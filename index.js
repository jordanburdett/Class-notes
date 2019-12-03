const express = require('express')
const path = require('path')
var bodyParser = require("body-parser");
const { Pool } = require('pg');
const PORT = process.env.PORT || 5000
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const connectionString = process.env.DATABASE_URL || 'postgres://jmlwlpbcygykii:2f25078c1b40aa0e34cc00289105fc9ec4840796218632593134ad4ed9790035@ec2-174-129-253-125.compute-1.amazonaws.com:5432/dfccmfhmslfb1a?ssl=true'
const pool = new Pool({ connectionString: connectionString });




express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
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



      res.json(result.rows);


    })

  })
  .get('/getAssignments', (req, res) => {
    var user_id = 1;
    var class_id = req.query.class_id;
    var sql = "SELECT id, title, description, due_date, finished FROM assignments ";
    sql += "WHERE user_id = " + user_id + " AND class_id = " + class_id;
    sql += "ORDER BY id";

    pool.query(sql, (err, result) => {
      if (err) {
        console.log("Error in assignment query");
      }


      res.json(result.rows);
    })

  })
  .get('/login', (req, res) => res.render('pages/login'))
  .get('/getLoginForm', function (req, res) {

    res.render('pages/loginForm');
  })
  .get('/getSignUpForm', (req, res) => res.render('pages/loginForm'))
  .post('/checkUserInfo', function (req, res) {

    //TODO check the database for user with these natural keys

    let email = req.body.email;
    let password = req.body.password;


    // if we are valid send them here!
    res.render('pages/main');
  })
  .post('/checkAssign', (req, res) => {
    //get user id first or checked if we are logged in
    let user_id = 1;
    let assignmentId = req.body.assignmentId;

    var sql = "UPDATE assignments SET finished = true WHERE user_id = " + user_id + " AND id = " + assignmentId;

    pool.query(sql, (err, result) => {
      if (err) {
        console.log("error updating info");
      }
      else {
        console.log("Successfully updated.")
      }
    })


  })
  .post('/saveNote', (req, res) => {
    //check if logged in and get user id   TODO
    let user_id = 1;
    let assignmentId = req.body.assignmentId;
    let class_id = req.body.classId;
    let content  = req.body.content;

    if (assignmentId) {
      //query for assignment note
    }
    else {
      //query for class note
      

      var sql = "UPDATE class SET note = '" + content + "' WHERE user_id = " + user_id + " AND id = " + class_id;
      console.log(content);
      pool.query(sql, (err, result) => {
        if (err) {
          console.log("error updating info");
          console.log(err);
        }
        else {
          console.log("Successfully updated.")
        }
      })

    }

  })
  .post('/unCheckAssign', (req, res) => {
    //get user id first or checked if we are logged in
    let user_id = 1;
    let assignmentId = req.body.assignmentId;

    var sql = "UPDATE assignments SET finished = false WHERE user_id = " + user_id + " AND id = " + assignmentId;

    pool.query(sql, (err, result) => {
      if (err) {
        console.log("error updating info");
      }
      else {
        console.log("Successfully updated.")
      }
    })


  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


