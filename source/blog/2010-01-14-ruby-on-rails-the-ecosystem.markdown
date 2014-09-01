--- 
layout: post
title: Ruby On Rails - The Ecosystem
wordpress_url: http://ralovely.com/?p=198
---
There's a catch ! (One could argue that _there's always a catch_, but still).

When you begin learning Ruby on Rails, you quickly realize that it's not going to be that simple.  
Several reasons.  
The first one is so obvious that it's in the name of the technology: **there are 2 things to learn**. Rails, of course, but Ruby also. And, at the beginning, it's hard to tell what feature comes from the former or the latter.  
Ruby is the language, really nice and clear and concise.  
Rails is the framework, powerful, but performing a lot of magic in the background, making it that much harder to see the whole picture.  
Second, Ruby is fairly young (1998) compared to other languages such PERL (1987).  
Rails is even younger (2003). _(Oddly, PHP is fairly young (1995) although it seems it's been around forever)_  
It's a strength, since it's better suited for today's rich web environment, including modern concepts such as AJAX at its core, for instance. But on the other hand, there is much less resources than there is for older languages.  
Even with RoR being the hot thing around the web for the last 2 years, there are very few open source projects available for integration or learning. Blog engines or CMS are still scarce, and even if plugin and gems come in number, snippets of code are not as ubiquitous as for, say, PHP. We have yet to see a blog engine as powerful as Wordpress, or a good bulletin board or webmail engine.  
Since it's young, there are fewer developers. On the other hand, these are also the early adopters, the most passionate, the most willing to learn and to share, and maybe, simply put, the best.  
But they can be hard to follow sometimes:  
\- _You do this, you put that there, and done._  
\- _Uh... OK, but... Sorry, I didn't catch that first..._  
Rails being young, its evolution is blazingly fast. New seed available every other month, new features, new ways of doing things...  
As soon as version 2 was out, they announced merging with Merb, eventually bringing a whole lot of new things to learn.  
There is no time to rest (_yes, geek-pun a little intended_).  
Also, you can have more trouble finding what I call mid-level resources.  
You know, the thing between _The 15 min blog engine_ and the _upcoming new killer feature_ of the edge version ; the solutions to the kind of problems you encounter as you begin mastering the syntax and building more complex apps, but are still a few years from calling yourself a guru...  
It's getting better though, especially with Ryan Bates's excellent screencasts at [railscasts.com](http://railscasts.com/ "railscasts").  
He has a way of making things look really simple and natural, and can explain pretty much anything in just a few minutes.  
And all that, is just for Ruby and Rails.  
Along, comes a slew of surrounding technologies (the Ecosystem) you have to learn, one way or the other, if only just a bit.  
[ Capistrano](http://www.capify.org/ "capistrano"), for smooth rails deployment scenarii ; [ Git](http://git-scm.com/ "git"), for an effective version controlling system (and [GitHub](https://github.com/ "GitHub") for the closest thing geeks have to a social network); chances are that you will have to drop your good ol'pal Apache server, in favor of a Mongrel stack, or at least manage a [Passenger Phusion](http://www.modrails.com/ "Phusion") plug in ; and also Gems, Rake tasks...  
and all these technologies, being, for the most part, even younger than RoR, have that much less resources.

All in all, there are still plenty of reasons to go on.  
Rails has a way to speed up development time drastically, Capistrano makes deployment as simple as "cap deploy" and Gems and plugin bring powerful tools or handy little functions to your app with not much more than a few lines of code.  
Just beware that this [Build your blog in 15 min screencast](http://media.rubyonrails.org/video/rails_blog_2.mov "Rails 15m blog screencast") or that [Up and Running with Rails](http://oreilly.com/catalog/9780596101329 "O'Reilly Up and Running Rails") book might have misleading titles.

Since I talk about resources, let's share some.  
The first and absolute best would be Ryan Bates's [RailsCasts](http://railscasts.com/ "Railscasts").  
5 to 20 minutes, one topic at a time, free (but donations accepted).  
Even if the first ones are pretty simple, he doesn't spend time explaining all the ins and outs: Railscasts are best served after a good ol'book. (see next post for that)  
Just after come the APIs : [Official Documentations](http://api.rubyonrails.org/ "Rails API"). It's actually embedded with ruby and rails ; use the _ri_ command. A little bit intimidating at first, but once you search a few commands, it becomes more familiar and quite powerful. I like keeping them in html format locally (at least on my laptop).  
Ruby ones (the Ruby Core and the Standard Library) are at [ruby-doc.org](http://www.ruby-doc.org "Ruby Docs") .  
and I always carry around the enhanced HTML-formatted Rails API doc of [Railsbrain.com](http://railsbrain.com/ "Railsbrain").  
[Peepcode](http://peepcode.com/ "Peepcode") has very good screencasts, not very expensive.  
The good thing is that they cover lot of the technologies of the Rails Ecosystem.  
There are a few tutorials, more or less thorough.  
They usually cover a specific feature or plugin, but there, [Google](http://www.google.fr/search?q=rails+tutorials "Google's Rails Tutorial") is your very good friend, since it's closely related to the app you're building.
