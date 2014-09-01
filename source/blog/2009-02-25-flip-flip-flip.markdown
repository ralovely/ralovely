--- 
layout: post
title: Flip! Flip! Flip!
wordpress_url: http://ralovely.com/?p=78
---
I could make a t-shirt with that :

_A few months ago, I was raving for the soon-to-be-released [Sony](http://www.sonystyle.com/webapp/wcs/stores/servlet/ProductDisplay?catalogId=10551&storeId=10151&langId=-1&productId=8198552921665400969 "Sony") and [Sanyo](http://www.sanyo-dsc.com/english/products/vpc_hd1010/index.html "Sanyo") tiny/HD/pricy camcorders...and all I got was a [Flip](http://www.theflip.com/products_flip_mino.shtml "Flip")..._

It's low res, it has no function at all but it changed my D-life.  
Better than the _One Ring_: you don't need [8 phrases](http://en.wikipedia.org/wiki/Rings_of_Power "8") to describe it, one is enough: _On button to rule them all_.

[Gruber](http://daringfireball.net/ "Gruber"), among many others, started to talk about it a month or so earlier. I even tried to debate it with him on Twitter — pointless: you can't beat the Flip (and you can't beat Gruber).  
I can't tell you what it does: it does nothing but record video. And that's the whole point.  
640x480 - 30fps. Output a divx-wrapped mpeg of good quality, that you can access as if it was on a thumb key. Tiny screen, play, pause, delete.  
And **one big red button**.  
It performs really well in low-light conditions.  
You can seize any moment; would it be only 10 seconds long, you'd still catch the last 7.  
I think that even if my iPhone was recording video, I would keep carrying my Flip in my pocket.  
So, now for the tech part of the post: Quality is fine, but Divx sucks.  
I don't want my whole life being stuck in this MS-non evolving-10yo. format.  
I don't want to spend my life converting video either.  
So, here are a few applescripts to take care of that (mainly originating from this [forum post](http://macscripter.net/viewtopic.php?id=15111)).  
Mainly, it takes one or several .AVI files, via Drag&Drop or File Selection, launch QT, convert the files according to two QT Settings, save the resulting export in a folder, and moves the original file in a _Done_ folder.  
There is a second little script, to export the QT Settings.  
Paths are hardcoded: _Convention over Configuration_.  
To set up your environment:
1. Create the directory hierarchy that suits you. Mine is a video folder, containing a __to_be_converted_ folder,  a __tools_ folder (containing the scripts and QT Settings, and the converted videos at the first level.
2. Export your desired QT Settings: Convert a video with the settings, then launch the QTSetsExport script.  
Place your settings in your folder _tools_.
3. Modify the ConvertMyVideos script to reflect your hierarchy.  
Be careful, applescript expects HFS formatted paths and not posix.
4. Start Converting !
[Here is a \.zip](http://ralovely.com-assets.s3.amazonaws.com/AS-QTExport.zip "Here is a \.zip") with my hierarchy, scripts, settings etc...  
You just have to expand and copy it on your HD, edit the script with the location of the folder and you're done. Settings export in H264, 5kb-640x480-AAC128k and 1k-480x360-AAC96k.

_\[Disclaimer: This is a really old post (july 08) kept as a draft until now. I still wanted to publish it, in the hope to help a lost soul with the scripts...\]_