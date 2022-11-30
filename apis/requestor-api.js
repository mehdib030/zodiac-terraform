var mysql = require('mysql');

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    console.log(event);
    
    console.log('Request parameters = ',event.queryStringParameters);
    
    console.log('Http Method : '+event["httpMethod"]);
    
    let eventType = event.httpMethod;
    let sql='';
    
    
    
    let requestorId;
    let username='';
    let firstName='';
    let lastName='';
    let email='';
    
    if (event.body) {
        let body = JSON.parse(event.body)
        if (body.first_name) {
            firstName = body.first_name;
        }
        if (body.last_name) {
            lastName = body.last_name;
        }
        if(body.email){
            email=body.email;
        }
        if(body.requestorId){
            requestorId=body.requstorId;
        }
          if(body.username){
            username=body.username;
        }
    }
     
    console.log("REQUEST BODY: \n" + event["body"]);
    
    console.log('First Name = ', firstName);
    console.log('Last Name = ', lastName);
    console.log('Email = ', email);

    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    
     if(eventType === 'POST'){
          sql = `insert into requestor (first_name, last_name, email,username) values ('${firstName}', '${lastName}', '${email}','${username}')`;
     } else if (eventType ==='GET'){
          if(event.queryStringParameters){
              let username = event.queryStringParameters.username;
              console.log('THE USER NAME = ',username);
               sql = `select * from requestor where username='${username}';`;
                //sql = `select * from requestor r, contact c where r.requestor_id=c.requestor_requestor_id and username='${username}';`;
          } else {
               sql = `select * from requestor;`;
          }
         
     }
    
    console.log("Connecting to Zodiac ...");

    var connection = mysql.createConnection({

        host: "cloudchallengezodiac.cmeewp1aqck4.us-east-1.rds.amazonaws.com",
        
        port:"3307",

        user: "cloudZodiac",

        password: "zodiacTeam5",

        database: "cloudChallengeZodiac",

    });

   // connection.query('show tables', function (error, results, fields) {
   // connection.query('CREATE TABLE registration (name VARCHAR(50), email VARCHAR(50), effectiveDate Date, expirationDate Date)',function (error, results, fields) {
   connection.query(sql,  (error, results, fields) => {
  

          console.log("Inside Callback ... ");

        if (error) {
            
            
            console.log("Error ... ");

            connection.destroy();

            throw error;

        } else {

            // connected!

            console.log("Query result:");

            console.log(results);
              const response = {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                    },
                    body: JSON.stringify(results),
                };

            callback(error, response);

            connection.end(function (err) { callback(err, results);});

        }
  
    });


    
    // TODO implement
    const response = {
        statusCode: 200,
           headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                    },
        body: JSON.stringify('Hello from Lambda Mehdi!'),
    };
    return response;
};
