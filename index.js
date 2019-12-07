require('dotenv').config();

const express = require('express')
const path = require('path')
var bodyParser = require("body-parser");
const { Pool } = require('pg');
const PORT = process.env.PORT || 5000
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const connectionString = process.env.DATABASE_URL || 'postgres://jmlwlpbcygykii:2f25078c1b40aa0e34cc00289105fc9ec4840796218632593134ad4ed9790035@ec2-174-129-253-125.compute-1.amazonaws.com:5432/dfccmfhmslfb1a?ssl=true'
const pool = new Pool({ connectionString: connectionString });

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



function authenticateToken(req, res, next) {

  const token = req.headers['accesstoken'];

  const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (user == null) {
    res.status(403);
  }

  req.user = user;
  next();
}

express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {

    res.render('pages/main')
  })
  .get('/getClasses', authenticateToken, function (req, res) {
    //ensure that we are logged in if we are not return something saying go to login page

    ///////////////////////////////////////////////?TODO!!!!!TODO!!!!TODO!!!!!TODO!!!!!!!!
    // go through and add your middle ware to everything... go through clientside and ensure the header is passed with each call
    ////////////////////////////////?TODO////////////////////////////////////////////////////////////////////////////////////////

    console.log(req.headers['accesstoken']);

    //connect to database with session data about the current user query with where user_id = 'user_id'
    console.log("THE ID for the user is " + req.user.id);
    var id = req.user.id;


    if (req.query.classId) {
      var sql = "SELECT note FROM class WHERE user_id = " + id + " AND id = " + req.query.classId + "Order by class_name";
    }
    else {
      var sql = "SELECT * FROM class WHERE user_id = " + id + "Order by class_name";
    }

    pool.query(sql, function (err, result) {
      if (err) {
        console.log("Error in query: ");
      }



      res.json(result.rows);


    })

  })
  .get('/getAssignments', authenticateToken, (req, res) => {
    var user_id = req.user.id;
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
  .post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    console.log(password);

    var sql = "SELECT * FROM user_account WHERE username = '" + username + "'";

    pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        console.log("Error in assignment query");

        res.status(401);
      }
      console.log(result);
      console.log("row count is " + result['rowCount']);
      if (result['rowCount'] == 0) {
        console.log("IN COMPARE");
        res.json({
          error: true,
          msg: 'Username not found... create a account',
          code: 1
        })
        return;
      }

      bcrypt.compare(password, result.rows[0].password, (err, isSame) => {
        if (err) {
          res.json({
            error: true,
            msg: err,
            code: 10
          });

          return;
        }

        // Its the same so send them the authorization token that contains everything.
        if (isSame) {
          console.log("they are the same! AUTHENTICATED!!!!");

          const user = {
            username: username,
            first_name: result.rows[0].first_name,
            last_name: result.rows[0].last_name,
            id: result.rows[0].id
          };

          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          res.json({
            error: false,
            accessToken: accessToken
          });

        } else {
          res.json({
            error: true,
            msg: 'Incorrect Password',
            code: 2
          });
          return
        }
      });
      console.log(result.rows[0].password);
    })

    //USE BCRYPT TO COMPARE PASSWORDS AND SUCH --- SEE TEAM ACTIVITY FOR EXAMPLE

  })

  .post('/checkAssign',authenticateToken, (req, res) => {
    //get user id first or checked if we are logged in
    let user_id = req.user.id;
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
  .post('/addNewClass', authenticateToken, (req, res) => {

    let user_id = req.user.id;
    let title = req.body.title;
    let shortDesc = req.body.shortDesc;
    let description = req.body.description;
    console.log(user_id + " AUTHENITCATE TOKEN ADDING CLASS");

    var sql = "INSERT INTO class (user_id, class_name, short_desc, description)";
    sql += "VALUES (" + user_id + ",'" + title + "','" + shortDesc + "','" + description + "')";

    pool.query(sql, (err, result) => {
      if (err) {
        console.log("error updating info");
        console.log(err);
        res.json('false');
      }
      else {
        console.log("Successfully updated.")
        res.json('true');
      }


    })
  })
  .post('/saveNote', authenticateToken, (req, res) => {
    //check if logged in and get user id   TODO
    let user_id = req.user.id;
    let assignmentId = req.body.assignmentId;
    let class_id = req.body.classId;
    let content = req.body.content;

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
          res.json('false');
        }
        else {
          console.log("Successfully updated.")
          res.json('true');
        }


      })


    }

  })
  .post('/unCheckAssign', authenticateToken, (req, res) => {
    //get user id first or checked if we are logged in
    let user_id = req.user.id;
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
  .get('/amIloggedIn', authenticateToken, (req, res) => {
    console.log("Yupper I am logged in!");
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));





