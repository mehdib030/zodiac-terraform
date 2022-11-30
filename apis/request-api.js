var mysql = require('mysql');

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    console.log('Http Method : '+event["httpMethod"]);
    
    console.log(event);
   // let request1 = JSON.parse(event.body)
    
    let eventType = event.httpMethod;
    let sql='';
    
    let requestId='';
    let requestUUID='';
    let requestorId=-1;
    let status='';
    let contacts=[];

   
  
        
    let request = JSON.parse(event.body);
    
    if (event.body) {
         let request = JSON.parse(event.body);
      
         if (request.requestId) {
            requestId= request.requestId;
        }
        
         if (request.requestor_requestor_id) {
            requestorId= request.requestor_requestor_id;
        }
        
          if (request.requestorId) {
            requestorId= request.requestorId;
        }
        
        if (request.uuid) {
            requestUUID = request.uuid;
        }
        if (request.status) {
            status = request.status;
        }
        if(request.contacts){
            contacts=request.contacts;
        }
    }
     
    // console.log("REQUEST BODY: \n" + event["body"]);
    // console.log('Request UUID= ', request.requestId);
   // console.log('Request UUID= ', request.uuid);
   // console.log('Status = ', request.status);
  //  console.log('Contacts = ', contacts);

    //console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    
     if(eventType === 'POST'){
          sql = `insert into request (uuid, status, requestor_requestor_id) values ('${requestUUID}', '${status}', ${requestorId});SET @request_id = LAST_INSERT_ID();`
               for(let contact of contacts) {
                    console.log("Contact = ",contact);
                     sql += `INSERT INTO request_contact (request_request_id,contact_contact_id) VALUES (@request_id, ${contact.contact_id} );`;
                }
                
                console.log("SQL = ", sql);
                
     } else if (eventType ==='GET'){
          if(event.queryStringParameters){
              let uuid = event.queryStringParameters.uuid;
              let requestorId = event.queryStringParameters.requestorId;
              let requestId = event.queryStringParameters.requestorId;
              if(uuid){
                 sql = `select * from request where request_uuid = '${uuid}'`;
             } else if(requestorId){
                 sql = `select * from request where requestor_requestor_id = ${requestorId}`;
             }
         }
        
          
     } else if (eventType ==='PUT'){
         sql = '';
          for(let contact in contacts) {
                     sql + `INSERT INTO request_contact (request_request_id,contact_contact_id) VALUES( '${requestId}', '${contact.contact_id}' );`;
          }
     }
     
     console.log("SQL = ", sql);
    
    console.log("Connecting to Zodiac ...");

    var connection = mysql.createConnection({

        host: "cloudchallengezodiac.cmeewp1aqck4.us-east-1.rds.amazonaws.com",
        
        port: "3307",

        user: "cloudZodiac",

        password: "zodiacTeam5",

        database: "cloudChallengeZodiac",
        
        multipleStatements: true

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
        body: JSON.stringify('Hello from Lambda Mehdi!'),
    };
    return response;
};