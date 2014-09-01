---
layout: post
title: A Capistrano Task To Sync The Database Config File
---


For the railers out there,  
here is a Capistrano task to keep your server database config in sync with what's on your local machine.

It's common knowledge: you don't check-in your database file in your repository because it contains your password.  
One usually put it in the shared directory after the deploy:setup command was run, and it is copied at each deploy.
But because we're so used to have the deploy command updating each and every file,  
and because the database.yml file isn't updated often,  
you can, as I did, ruin two hours, wondering why your passenger ask for mysql2 even if you have changed your database file accordingly. But locally...

It won't happen anymore.  
I wrote a Capistrano task that rsync the local database file to the shared/config directory before each deploy.

Put that in your deploy.rb file, inside the deploy namespace.

```ruby
  desc "Update remote database file with local copy"
  task :update_database_config do
     run_locally("rsync --times --rsh=ssh --compress --human-readable --progress config/database.yml #{user}@#{domain}:#{shared_path}/config/database.yml")
  end
```

and this at the end of the file

```ruby
before "deploy:update_code", "deploy:update_database_config"
```
