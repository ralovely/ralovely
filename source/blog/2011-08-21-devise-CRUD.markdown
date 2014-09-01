---
layout: post
title: Add CRUD logic to Devise
---

If your app authentication is handled by Devise,  
and you want to be able to administer your users' account in your app,  
you'll need a CRUD controller and the associated views.

Devise's wiki has a lot of resources, including this one: [How-To:-Manage-users-through-a-CRUD-interface](https://github.com/plataformatec/devise/wiki/How-To:-Manage-users-through-a-CRUD-interface). (I since edited the page to reflect these changes).

I found out that it needs a little correction and an addedum.
* The path_preffix in the routes file is not optional. If you don't add it, rails will mix up edit routes.
* In your controller's update method, you need to check if the pssword is blank. If so, remove the key from the hash. If not, Devise will fail its validations.

```ruby
if params[:user][:password].blank?
  params[:user].delete(:password)
  params[:user].delete(:password_confirmation)
end
```
