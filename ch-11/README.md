#### Basic Node Authentication: Setup and Local
```
Authentication and logins in Node can be a complicated thing. Actually logging in for any application can be a pain. This article series will deal with authenticating in your Node application using the package Passport.
```
#### WHAT WE’LL BE BUILDING:

We will build an application that will have:

  - Local account logins and signups (using passport-local)
  - Facebook logins and registration (using passport-facebook)
  - Twitter logins and registration (using passport-twitter)
  - Google+ logins and registration (using oauth with passport-google-oauth)
  - Require login for certain routes/sections of your application
  - Creating a password hash for local accounts (using bcrypt-nodejs)
  - Displaying error messages (using flash with connect-flash. required since express 3.x)
  - Linking all social accounts under one user account
  - Allowing a user to unlink a specific social account
  -

#### Structure
```
- app
    ------ models
    ---------- user.js  <!-- our user model -->
    ------ routes.js    <!-- all the routes for our application -->
    - config
    ------ auth.js      <!-- will hold all our client secret keys (facebook, twitter, google) -->
    ------ database.js  <!-- will hold our database connection settings -->
    ------ passport.js  <!-- configuring the strategies for passport -->
    - views
    ------ index.ejs    <!-- show our home page with login links -->
    ------ login.ejs    <!-- show our login form -->
    ------ signup.ejs   <!-- show our signup form -->
    ------ profile.ejs  <!-- after a user logs in, they will see their profile -->
    - package.json      <!-- handle our npm packages -->
    - server.js         <!-- setup our application -->
```

#### Files information
```
app.post: For now, we will comment out the routes for handling the form POST. We do this since passport isn’t set up yet.

req.flash: This is the connect-flash way of getting flashdata in the session. We will create the loginMessage inside our passport configuration.

isLoggedIn: Using route middleware, we can protect the profile section route. A user has to be logged in to access that route. Using the isLoggedIn function, we will kick a user back to the home page if they try to access http://localhost:8080/profile and they are not logged in.

Logout: We will handle logout by using req.logout() provided by passport. After logging out, redirect the user to the home page.

With our server running, we can visit our application in our browser at http://localhost:8080. Once again, we won’t see much since we haven’t made our views. Let’s go do that now.

passport.js     All the configuration for passport will be handled in config/passport.js. We want to keep this code in its own file away from our other main files like routes or the server file. I have seen some implementations where passport will be configured in random places. I believe having it in this config file will keep your overall application clean and concise.
```
