+++
categories = ["TECH","HACKATHON"]
date = "2018-04-08T20:33:28-05:00"
description = "Me at Madhacks Mini"
featured = ""
featuredalt = ""
featuredpath = ""
linktitle = ""
title = 'Hackathons'
type = "post"
draft = false
+++

I was at UW-Madison's [Madhacks Mini](http://madhacks.org/) today. This was a 12 hour, beginner-friendly mini-hackathon to give new hackers a glimpse into what hackathons are like.

## So why hack?

What are the chances that I will wake up at 8 AM on a Saturday, wolf down whatever breakfast I can get my hands on and get down to brainstorming, coding and trying out new things? Practically nothing.

Stashed across Keep and One Note and Wunderlist are ideas of things I wanted to build, ideas that seem really cool but are relegated to being looked at longingly every other week - "If only I had time". I got started with a few, but left them half done. For a while I thought I was like Willy Wonka (the Wilder version) ![Willy Wonka last scene with halved things](https://i.stack.imgur.com/tivC3.jpg) I just liked things half done.

But that's beside the point. Hackdays are fun, they are motivating and an opporunity to work with people I normally don't get a chance to work with, and they are fun.

____

There was a bit of discuscussion about Hackathons being exploitive (see this Wired article - [Sociologists Examine Hackathons and See Exploitation](https://www.wired.com/story/sociologists-examine-hackathons-and-see-exploitation/)). I am not a fan of hackdays where you are expected to work with the sponsor's API or solve problems the sponsor poses, it just seems like a way to get free labor.

    _aside_: The Netflix prize: Netflix set up a $1M prize to develop a better recommendation algorithm. The genius behind it - getting all the worlds researchers working on their problem at a fraction of the cost of hiring full time scientists and engineers to work on it.

Corporate hackathons are an evolution of the Netflix prize.
___

## What we built today

First we bounced the idea of building a social network that actually places emphasis on meeting people. Using NFC in your phone/smart watch we'd recognize if you fist-bumped someone and record that as an interaction. We built up a quick app to use that, tested it on the emulator and then discovered that neither of our phones had NFC capablities. So...shelved.

Then we juggled with the idea of making an AR/Neural style transfer app for Android.
Neural style transfer takes in images like this:
![Photo of Chicago skyline](/img/chicago.jpg)

and ![Rain Princess painting](/img/rain_princess.jpg)

and generates a result like:

![Photo of Chicago after neural style transfer](/img/chicago_rain_princess.jpg)

I thought it was super cool, but then things got complicated:

- The training time of the neural net was 4-6 hours on a Maxwell Titan X. Neither of us had a GPU that powerful
- We downloaded a trained model, but it takes 3-10 seconds per image on our PCs. Which is unreasonable for processing videos. This meant we could design a system of buffering and a delayed video playback which - in the throes of the hackathon spirit - seemed to reduce the coolness quotient. On to the next idea!

While this was going on we hacked up a quick idea to silence our phones when it rings at less than ideal moments. Imagine this: you are on stage, presenting to a class, or talking to someone when your phone begins to ring. Wouldn't it be great if you could just smack your phone and shut it up rather than having to fumble through your pockets for it to hit the mute button?

So that is what we built. Presenting Shut up! See the code on [Github](https://github.com/pavankm/shutup)
____

You can see all the submissions from UW-Madison's Madhacks Mini here: [madhacks-mini.devpost.com](https://madhacks-mini.devpost.com/)