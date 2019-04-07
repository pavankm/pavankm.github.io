+++
author = ""
categories = []
description = ""
linktitle = ""
title = "Hugo from a user's perspective - The basics"
featured = ""
featuredpath = ""
featuredalt = ""
type = "post"
draft = false
+++

I decided to use Hugo to generate this site for no particular reason. For a smaller site like mine, it really shouldn't matter what static site generator is used, unless you have a strong preference for one language over another

For most of the tools I use, I am content with learning just how to use it to my purpose and not much beyond that. But I thought I should really try to dig underneath the surface to appreciate the work that goes in to making something like Hugo. This post is one in what I hope will be a series where I understand what makes Hugo tick.

_**!**_ I am on hugo v0.43. Some things might be different if you are on a different version.

## Structure of a post

### What is in the header of the post

#### slug

Usually the URL of the file is taken from the file name _blog/old-post.md_ gets the url _blog/old-post_. But this can be overridden by the slug property
so if the header contains

```TOML
+++
title = "post title"
slug = "new-post"
+++
```

then it would have gotten _blog/new-post_ as its URL.

#### type

#### layout

#### url

The entire URL can be specified for a page. This has to be the URL from the base
ex:

```TOML
+++
title = "post title"
slug = "slug-url"
url = "/blog/new-url"
```

will make the page get the URL _example.com/blog/new-url_

What do the values mean?

### How is that used

## Hugo folder structure

Everything that goes in the `content` folder becomes top level URLs and renders the file `_index.md` in that folder.
Every nested folder within it is accessible through the URL.

_**example:**_

```bash
.
+-- content
    +-- about
    |    +-- _index.md  // <- https://example.com/about/
    +-- posts
    |   +-- firstpost.md   // <- https://example.com/posts/firstpost/
    |   +-- happy
    |   |   +-- ness.md  // <- https://example.com/posts/happy/ness/
    |   +-- secondpost.md  // <- https://example.com/posts/secondpost/
    +-- quote
        +-- first.md       // <- https://example.com/quote/first/
        +-- second.md      // <- https://example.com/quote/second/
```

>_**Q:**_ Can I have both an `_index.md` and some other md file in a folder? like combining the _about_ and _posts_ folder from the example.   
-> Yup. The [/blog](/blog) link on this website has an `_index.md` and also pages under it like [/blog/stoic](/blog/stoic)  


>**_Q_** Can a nested folder have an `_index.md` ?  
-> Yes. And there is no difference in the URL between a nested `_index.md`. For example _/about/hello_ could be coming from

```bash
about
+-- hello.md
```

or

```bash
about
+-- hello
    +-- _index.md
```

The top levels (i.e. content/<DIRECTORIES>) or folders that _index.md_ are special in Hugo and are considered the content type used to determine layouts etc.
These are called _**Sections**_. A section is a collection of pages.
This has a bearing since __index.md__ pages are rendered as list pages with their own content + a list of all the other pages and not like other single pages.


## What is a toml file

## Do I need to use markdown

## Hugo themes

### What is an archetype

### How to install a theme

### Customizing a theme

### What goes in a theme's toml file

## Commands I need to remember

**_Q_** Could I just create md files from my editor than having to rely on `hugo new <filename>` ?

## Sources