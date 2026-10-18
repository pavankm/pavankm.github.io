import { countWords } from "./words.mjs";

const content = document.getElementById("content");
const stopWords = document.getElementById("stop-words");
const defaultStopWords = stopWords.value;
const svg = document.getElementById("cloud");
const wordsGroup = document.getElementById("words");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const error = document.getElementById("error");
const emptyPreview = document.getElementById("empty-preview");
const svgButton = document.getElementById("download-svg");
const pngButton = document.getElementById("download-png");
const namespace = "http://www.w3.org/2000/svg";
const width = 1024;
const height = 640;
const font = "Georgia";
const colors = ["#513525", "#98512f", "#365e63", "#605185", "#65703b", "#9a3c55"];
let layout;
let drag;
let generation = 0;

const theme = document.documentElement;
theme.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
document.getElementById("theme-toggle").addEventListener("click", () => {
  theme.dataset.theme = theme.dataset.theme === "dark" ? "light" : "dark";
});

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

function transformWord(element, word) {
  element.setAttribute("transform", `translate(${word.x},${word.y})`);
}

function moveWord(element, word, x, y) {
  const box = element.getBBox();
  word.x = Math.max(-width / 2 - box.x, Math.min(width / 2 - box.x - box.width, x));
  word.y = Math.max(-height / 2 - box.y, Math.min(height / 2 - box.y - box.height, y));
  transformWord(element, word);
}

function pointerPosition(event) {
  return new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
}

function makeDraggable(element, word) {
  element.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    const point = pointerPosition(event);
    drag = { element, word, pointerId: event.pointerId, dx: point.x - word.x, dy: point.y - word.y };
    element.setPointerCapture(event.pointerId);
    element.focus({ preventScroll: true });
    element.classList.add("dragging");
  });
  element.addEventListener("keydown", (event) => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 10 : 1;
    moveWord(element, word, word.x + direction[0] * step, word.y + direction[1] * step);
  });
}

svg.addEventListener("pointermove", (event) => {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const point = pointerPosition(event);
  moveWord(drag.element, drag.word, point.x - drag.dx, point.y - drag.dy);
});

function endDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  drag.element.classList.remove("dragging");
  drag = undefined;
}
svg.addEventListener("pointerup", endDrag);
svg.addEventListener("pointercancel", endDrag);
svg.addEventListener("lostpointercapture", endDrag);

function render(words) {
  const fragment = document.createDocumentFragment();
  words.forEach((word, index) => {
    const element = document.createElementNS(namespace, "text");
    element.textContent = word.text;
    element.setAttribute("font-family", font);
    element.setAttribute("font-size", word.size);
    element.setAttribute("text-anchor", "middle");
    element.setAttribute("fill", colors[index % colors.length]);
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `${word.text}, ${word.count} ${word.count === 1 ? "occurrence" : "occurrences"}. Use arrow keys to move.`);
    transformWord(element, word);
    makeDraggable(element, word);
    fragment.append(element);
  });
  wordsGroup.replaceChildren(fragment);
}

function generate() {
  const currentGeneration = ++generation;
  layout?.stop();
  drag = undefined;
  wordsGroup.replaceChildren();
  svgButton.disabled = true;
  pngButton.disabled = true;
  error.hidden = true;
  emptyPreview.hidden = false;
  emptyPreview.textContent = "Your words will take shape here.";
  preview.setAttribute("aria-busy", "false");
  const { words, uniqueCount } = countWords(content.value, stopWords.value);
  if (!words.length) {
    status.textContent = "No cloud generated.";
    showError(content.value.trim()
      ? "No words remain. Add words with at least two letters, or remove some stop words."
      : "Paste some content or try the sample text first.");
    return;
  }
  if (typeof window.d3?.layout?.cloud !== "function") {
    status.textContent = "The layout library is unavailable.";
    showError("The word-cloud script did not load. Reload the page and try again.");
    return;
  }
  const context = document.createElement("canvas").getContext("2d");
  if (!context) {
    status.textContent = "Canvas is unavailable.";
    showError("This browser does not support the Canvas text measurement needed to lay out words.");
    return;
  }
  const maxCount = words[0].count;
  const minCount = words.at(-1).count;
  words.forEach((word) => {
    const size = maxCount === minCount ? 42 : 18 + 78 * Math.sqrt((word.count - minCount) / (maxCount - minCount));
    context.font = `${size}px ${font}`;
    word.size = Math.max(1, Math.floor(Math.min(size, size * (width - 100) / Math.max(1, context.measureText(word.text).width))));
  });
  status.textContent = "Arranging words...";
  emptyPreview.textContent = "Arranging your words...";
  preview.setAttribute("aria-busy", "true");
  layout = window.d3.layout.cloud()
    .size([width, height])
    .words(words)
    .font(font)
    .fontSize((word) => word.size)
    .rotate(0)
    .padding(4)
    .timeInterval(12)
    .on("end", (placed) => {
      if (currentGeneration !== generation) return;
      preview.setAttribute("aria-busy", "false");
      emptyPreview.hidden = placed.length > 0;
      emptyPreview.textContent = "Your words will take shape here.";
      render(placed);
      if (!placed.length) {
        status.textContent = "No words could be placed.";
        showError("These words could not fit. Try shorter words or a different selection of content.");
        return;
      }
      svgButton.disabled = false;
      pngButton.disabled = false;
      const omitted = uniqueCount - placed.length;
      status.textContent = `${placed.length} of ${uniqueCount} unique words placed.`
        + (omitted ? ` ${omitted} omitted by the 120-word limit or because they could not fit.` : "")
        + " Drag words to rearrange them.";
    });
  layout.start();
}

document.getElementById("cloud-form").addEventListener("submit", (event) => {
  event.preventDefault();
  generate();
});
document.getElementById("reset-stop-words").addEventListener("click", () => {
  stopWords.value = defaultStopWords;
});
document.getElementById("sample").addEventListener("click", () => {
  content.value = "Creativity begins with curiosity. Curiosity leads to discovery, and discovery sparks ideas. "
    + "Ideas become stories, stories become connections, and connections build community. "
    + "Make space for creativity, curiosity, play, learning, and wonder. "
    + "Share your ideas. Explore new ideas. Build something beautiful. "
    + "Creativity grows through practice. Practice brings confidence. "
    + "Keep learning, keep making, and let curiosity guide your creativity.";
  generate();
});

function svgBlob() {
  const copy = svg.cloneNode(true);
  copy.removeAttribute("role");
  copy.removeAttribute("aria-labelledby");
  copy.querySelector("desc").textContent = "A word cloud generated locally in the browser.";
  copy.querySelectorAll("text").forEach((element) => {
    ["tabindex", "role", "aria-label", "class"].forEach((attribute) => element.removeAttribute(attribute));
  });
  return new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml;charset=utf-8" });
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

svgButton.addEventListener("click", () => download(svgBlob(), "word-cloud.svg"));
pngButton.addEventListener("click", async () => {
  const exportGeneration = generation;
  const url = URL.createObjectURL(svgBlob());
  pngButton.disabled = true;
  error.hidden = true;
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable for PNG export.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("The browser could not encode the PNG.");
    download(blob, "word-cloud.png");
  } catch (cause) {
    showError(`PNG export failed. ${cause.message} You can try saving as SVG instead.`);
  } finally {
    URL.revokeObjectURL(url);
    if (exportGeneration === generation && wordsGroup.childElementCount) pngButton.disabled = false;
  }
});
