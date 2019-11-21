const express = require('express')
const path = require('path')
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const connectionString = process.env.DATABASE_URL || 'postgres://jmlwlpbcygykii:2f25078c1b40aa0e34cc00289105fc9ec4840796218632593134ad4ed9790035@ec2-174-129-253-125.compute-1.amazonaws.com:5432/dfccmfhmslfb1a?ssl=true'
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});




express()
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res){ 

    
    //Check for login here and then send the correct page  
    res.render('pages/main')
  })
  .get('/getClasses', function (req, res) {
    //ensure that we are logged in if we are not return something saying go to login page


    //connect to database with session data about the current user query with where user_id = 'user_id'
    var id = 1;
    var sql = "SELECT * FROM class WHERE user_id = " + id + "Order by class_name";

    pool.query(sql, function (err, result) {
      if(err) {
        console.log("Error in query: ");
      }

      console.log(result.rows);

      res.json(result.rows);


    })

  })
  .get('/login', (req, res) => res.render('pages/login'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

  function showMailCost(requests, response) {
    let weight = requests.body.weight;
    let type   = requests.body.type;

    let answer = calcMailCost(weight, type);
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write('<a href="javascript:loadDetails();"><h1><i class="fas fa-envelope fa-md"></i> The total cost will be $' + Number(answer).toFixed(2) + '</h1></a>');
    response.end();
  }

  function calcStamp(weight) {
    let answer = 0;
    if (weight <= 1) {
      answer = 0.55;
    }
    else if(weight <= 2) {
      answer = 0.70;
    }
    else if(weight <= 3) {
      answer = 0.85;
    }
    else if (weight <= 3.5) {
      answer = 1.00;
    }
    else {
      console.log("ERROR invalid weight " + weight);
      answer = 100000000;
    }

    return answer;
  }

  function calcMetered(weight) {
    let answer = 0;
    if (weight <= 1) {
      answer = 0.50;
    }
    else if(weight <= 2) {
      answer = 0.65;
    }
    else if(weight <= 3) {
      answer = 0.80;
    }
    else if (weight <= 3.5) {
      answer = 0.95;
    }
    else {
      console.log("ERROR");
      answer = 100000000;
    }

    return answer;
  }

  function calcFlat(weight) {
    let answer = 0;
    if (weight <= 1) {
      answer = 1.00;
    } else if (weight <= 2) {
      answer = 1.15;
    } else if (weight <= 3) {
      answer = 1.30;
    } else if (weight <= 4) {
      answer = 1.45;
    } else if (weight <= 5) {
      answer = 1.60;
    } else if (weight <= 6) {
      answer = 1.75;
    } else if (weight <= 7) {
      answer = 1.90;
    } else if (weight <= 8) {
      answer = 2.05;
    } else if (weight <= 9) {
      answer = 2.20;
    } else if (weight <= 10) {
      answer = 2.35;
    } else if (weight <= 11) {
      answer = 2.50;
    } else if (weight <= 12) {
      answer = 2.65;
    } else if (weight <= 13) {
      answer = 2.80;
    } else {
      console.log("ERROR invalid weight");
      answer = 1000000;
    }

    return answer;
  }

  function calcFirstClass(weight) {
    let answer = 0;
    if (weight <= 4) {
      answer = 3.66;
    } else if (weight <= 8) {
      answer = 4.39;
    } else if (weight <= 12) {
      answer = 5.19;
    } else if (weight <= 13) {
      answer = 5.71;
    } else {
      console.log("ERROR invalid weight");
      answer = 1000000;
    }

    return answer;
  }



  function calcMailCost(w, t) {
    let weight = w;
    let type   = t;
    let answer;

    switch(type) {
      case "Letters (Stamped)":
        answer = calcStamp(weight);
      break;
      case "Letters (Metered)":
        answer = calcMetered(weight);
      break;
      case "Large Envelopes (Flats)":
        answer = calcFlat(weight);
      break;
      case "First-Class Package Service—Retail":
        answer = calcFirstClass(weight);
      break;
      default:
        console.log("ERROR invalid type");
      break;
    }

    return answer;
  }
