### Testing REST API using Mocha and Chai
#### PREREQUISITES

- Node.js: a basic understanding of node.js and is recommended as i wont go too much into detail on building a RESTful API.
- POSTMAN for making fast HTTP requests to the API.
- ES6 syntax: I decided to use the latest version of Node (6.*.*) which has the highest integration of ES6 features for better code readability. If you are not familiar with ES6 you can take a look at the great scotch articles (Pt.1 , Pt.2 and Pt.3) about it but do not worry I am going to spend a few words whenever we encounter some "exotic" syntax or declaration.

#### Mocha
  - Mocha: Testing Environment
  - Mocha is a javascript framework for Node.js which allows Asynchronous testing. Let’s say it provides the environment in which we can use our favorite assertion libraries to test the code.
  - Mocha comes with tons of great features, the website shows a long list but here are the ones I like the most:
      - simple async support, including promises.
      - async test timeout support.
      0 before, after, before each, after each hooks (very useful to clean the environment where each test!).
      - use any assertion library you want, Chai in our tutorial.




#### Chai
  - So with Mocha we actually have the environment for making our tests but how do we do test HTTP calls for example? Moreover, How do we test whether a GET request is actually returning the JSON file we are expective, given a defined input? We need an assertion library, that’s why mocha is not enough.
  - Chai shines on the freedom of choosing the interface we prefer: “should”, “expect”, “assert” they are all available. I personally use should but you are free to check it out the API and switch to the others two. Lastly Chai HTTP addon allows Chai library to easily use assertions on HTTP requests which suits our needs.

#### Structure
    --app
    ---- models
    ------ book.js
    ---- routes
    ------ book.js
    -- config
    ---- default.json
    ---- dev.json
    ---- test.json
    -- test
    ---- book.js
    package.json
    server.json

#### Package.json
```
    {
      "name": "bookstore",
      "version": "1.0.0",
      "description": "A bookstore API",
      "main": "server.js",
      "author": "Sam",
      "license": "ISC",
      "dependencies": {
        "body-parser": "^1.15.1",
        "config": "^1.20.1",
        "express": "^4.13.4",
        "mongoose": "^4.4.15",
        "morgan": "^1.7.0"
      },
      "devDependencies": {
        "chai": "^3.5.0",
        "chai-http": "^2.0.1",
        "mocha": "^2.4.5"
      },
      "scripts": {
        "start": "SET NODE_ENV=dev && node server.js",
        "test": "mocha --timeout 10000"
      }
    }
```

#### Resources
  - https://mochajs.org/
  - http://chaijs.com/
  - http://mherman.org/blog/2015/09/10/testing-node-js-with-mocha-and-chai/#.V7Hfc_krJaR
  - https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/
  - http://stackabuse.com/testing-node-js-code-with-mocha-and-chai/
