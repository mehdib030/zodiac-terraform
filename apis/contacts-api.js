var mysql = require('mysql');

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    console.log(event);
    
    console.log('Http Method : '+event["httpMethod"]);
    
    var eventType = event.httpMethod;
    var sql='';
    
    var firstName='';
    var lastName='';
    var email='';
    
    if (event.body) {
        let body = JSON.parse(event.body)
        if (body.firstName) {
            firstName = body.firstName;
        }
        if (body.lastName) {
            lastName = body.lastName;
        }
        if(body.email){
            email=body.email;
        }
    }
     
    console.log("REQUEST BODY: \n" + event["body"]);
    
    console.log('First Name = ', firstName);
    console.log('Last Name = ', lastName);
    console.log('Email = ', email);

    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    
     if(eventType === 'POST'){
          sql = `insert into contact (firstName, lastName, email) values ('${firstName}', '${lastName}', '${email}')`;
     } else if (eventType ==='GET'){
         
          if(event.queryStringParameters){
              let requestorId = event.queryStringParameters.requestorId;
              let requestId = event.queryStringParameters.requestId;
              console.log('THE REQUESTOR ID = ',requestorId); 
              if (requestorId && requestId){
                  sql = `SELECT contact_id, firstName, lastName, email, r.requestor_requestor_id FROM contact c, request_contact rc, request r where rc.request_request_id = ${requestId} and c.contact_id = rc.contact_contact_id and rc.request_request_id = r.request_id and r.requestor_requestor_id = ${requestorId} ; `
              } else if (requestorId){
                   sql = `select * from contact where requestor_requestor_id=${requestorId};`;
              }
              
          } else {
               sql = `select * from contact;`;
          }
     }
     
     console.log('SQL = ',sql);

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
                        "Access-Control-Allow-Methods": "*"
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
        body: JSON.stringify('Hello from Lambda Mehdi!'),
    };
    return response;
};
