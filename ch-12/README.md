#### What We’ll Be Building

We’ll build a quick API using Node and Express and we’ll be using POSTman to test it.

##### The main workflow of this is that we will:

- Have unprotected and protected routes
- A user will authenticate by passing in a name and a password and get back a token
- The user will store this token on their client-side and send it for every request
- We will validate this token, and if all is good, pass back information in JSON format
Our API will be built with:

##### normal routes (not authenticated)

- route middleware to authenticate the token
- route to authenticate a user and password and get a token
- authenticated routes to get all users

###### Further Reading: For some information on Express routing and middleware, check out our article on Express 4.0 routing.

##### TOOLS NEEDED

- node and npm
- POSTman

##### Frameworks & Modules
- express is the popular Node framework
- mongoose is how we interact with our MongoDB database
- morgan will log requests to the console so we can see what is happening
- body-parser will let us get parameters from our POST requests
- jsonwebtoken is how we create and verify our JSON Web Tokens

##### API routes
Create API Routes This includes the following routes:

-   POST http://localhost:8080/api/authenticate Check name and password against the database and provide a token if authentication successful. This route will not require a token because this is where we get the token.

-   GET http://localhost:8080/api Show a random message. This route is protected and will require a token.

-   GET http://localhost:8080/api/users List all users. This route is protected and will require a token.

##### Steps to run
```
npm install
node server
  or
nodemon server
```
And in POSTMan , please test these API in sequence
- First run and enter some users
```
http://localhost:8080/setup
```
- Now comment out JWT Validation Code from Server.js
```
\\Comment out following code in server.js to run without Token Authentication
// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn : 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});
```

and also comment following middleware interceptor for JWT calls

```
\\Comment out following code in server.js as well
// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});
```

- Now go to: http://localhost:8080/api/users and see the list of users.
- Now Uncomment all above code which we have commented in Server.js
- Now Authenticate User and get token
```
- Run POST http://localhost:8080/api/Authenticate
- In HEADER/BODY give user credentials
Name  John doe
Password password
```
- Now since John Doe is authenticated user now & we have his token, we can use it for authenticating api now.
- Now if you run http://localhost:8080/api , it will say, "No Token Provided"
- Provide x-access-token in Header with copied token from /Authenticate API

####### For more information on exact article https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
