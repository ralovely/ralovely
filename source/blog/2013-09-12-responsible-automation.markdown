---
layout: post
title: Responsible Automation 
---

As any sysadmin, I like to automate things.  
As a devops, I like to automate things for my users (my users being the developers).

I like to automate because I'm lazy (for boring repetitive tasks at least),  
but the main reason we automate is for safety.  
The safety of regularity, always doing the exact same thing, doing it every day (or every hour).

Yet, automation is a double-edged sword.  
A failing script can have pretty catastrophic consequences.  
Here is the logic and care I try to put behind what I like to call __Responsible&nbsp;Automation__.  
It's not a manifesto, but could become one.

## Let the User in control
As a sysadmin, the user would be yourself, as a devops, it would be the team of developers,
but in the end, there it makes no difference: the user has to stay in control of what happens.

The most basic control is launching the script.  
Not all automation is scheduled, in fact, most of them are triggered by a user.  
The most current example I have would be `cap deploy`:  
this simple command often result in quite a lot of automated logic and is used multiple times a day by most members of the team.

There are three way to give (a bit of) control to the user.  
The first, via options when calling the script.  
You need the command to be simple, so you must use sensible defaults. You need contextual help, via arguments checking, error messages and --help option.

The second is to prompt the user while executing of the script. This is powerful, sometimes mandatory, but often a smell for bad design at the beginning. Use it carefully, mainly to prompt for information that depend on the execution itself (ie. `File already exists, what should I do`). Avoid using it on long running scripts, where the user will do something else meanwhile, missing the prompt.

Then, there is the ctrl-c.  
Yes. As basic and terminal as it is, ctrl-c is also the most important piece of control over your script.  
It is a time based control, and it's usually not wise to race with a machine doing a couple of tera calculations per second. Yet, it can sometime save the day.  
To make that possible, try and make the irreversible operations happen later in your script.  
I even once had a script sleep a few seconds before executing a task.  
It helps if the script is idempotent, allowing to rerun it safely.  

To stay in control, the user must _know_ exactly what happens in the first place.

## Feedback
Instant feedback is key.  
For starter, it's an excellent form of documentation. I learned a ton about Capistrano, just reading the output while it was running.  
It is also a good way to double check settings: `About to deploy my-awesome-site in production` can be a very useful information if you were supposed to deploy `another-website in staging`…

I often use outputs to orient user towards the next step, if any.

Finding the right amount of feedback is important.  
Capistrano has often been criticised for its verbosity.  
This is the ideal candidate for an option.

## Logging & Monitoring
Retro active analysis can be a life saver, or at minimum a good tool to improve the system.  
__Log everything__. Disk space is cheap and parsing a huge data set can be done on the fly.  
Timestamp each line, if possible, id each request/action, be extra verbose.  
Log files don't have to be pretty, they have to be exhaustive.  
Write in several files if you have different concerns, this can help map-reduce the data, but it is mostly a human problem.

For long running script, try to monitor the performances: duration, CPU…  
This can be a good indication of a rising problem. If your script suddenly take twice the time as usual, find why.  
If you have a Nagios in your architecture, you could even plug some data in it, alerting on threshold values.  

## Document & Comment
This should be obvious.  
Either you are part of a team and you need to communicate abundantly,  
or you're alone and you need as much documentation as possible, preventing from the _key person risk_.

## Test & Stage
Unit-test your script. It will ease its development and future evolution.  
Test it again an environment too, virtual machine are cheap and easy.  


What follows is more about a personal method than a guideline.

## Granular & Incremental
At the beginning, for a few days or weeks, I like to do the task manually, really grasping the ins and outs, identifying the key sub-tasks. I usually write a scenario in plain text.  
Then I start to script the most obvious parts, continuing to tie them together manually.  
This granular approach allows for a better incremental evolution, each part is still independent from the others. It also helps seeing the little details that could be tricky and keeps them contained.  
Then I cement the pieces together.  
At this stage I still triggers the whole script manually, usually for a fortnight.  
When it feels ready, I pass it on to Cron or the team.  

