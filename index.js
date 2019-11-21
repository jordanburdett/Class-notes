const express = require('express')
const path = require('path')
var bodyParser = require("body-parser");
const { Pool } = require('pg');
const session = require('express-session');
const PORT = process.env.PORT || 5000
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const connectionString = process.env.DATABASE_URL || 'postgres://jmlwlpbcygykii:2f25078c1b40aa0e34cc00289105fc9ec4840796218632593134ad4ed9790035@ec2-174-129-253-125.compute-1.amazonaws.com:5432/dfccmfhmslfb1a?ssl=true'
const pool = new Pool({ connectionString: connectionString });




express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({secret: 'ssshhhhh'}))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    //Check for login here and then send the correct page  
    res.render('pages/main')
  })
  .get('/getClasses', function (req, res) {
    //ensure that we are logged in if we are not return something saying go to login page


    //connect to database with session data about the current user query with where user_id = 'user_id'
    var id = 1;
    var sql = "SELECT * FROM class WHERE user_id = " + id + "Order by class_name";

    pool.query(sql, function (err, result) {
      if (err) {
        console.log("Error in query: ");
      }

      console.log(result.rows);

      res.json(result.rows);


    })

  })
  .get('/login', (req, res) => res.render('pages/login'))
  .get('/getLoginForm', function (req, res) {
    console.log("in get loginform");
    res.render('pages/loginForm');
  })
  .get('/getSignUpForm', (req, res) => res.render('pages/loginForm'))
  .post('/checkUserInfo', function (req, res) {
    
    //TODO check the database for user with these natural keys
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;


    // if we are valid send them here!
    res.render('pages/main');
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


