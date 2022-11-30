const aws = require('aws-sdk');
const mysql = require('mysql');
const sns = new aws.SNS()
const s3 = new aws.S3();
var sqs = new aws.SQS({apiVersion: '2012-11-05'});


console.log('Loading function');

 var connection = mysql.createConnection({

        host: "cloudchallengezodiac.cmeewp1aqck4.us-east-1.rds.amazonaws.com",
        
        port: "3307",

        user: "cloudZodiac",

        password: "zodiacTeam5",

        database: "cloudChallengeZodiac",
        
        multipleStatements: true

    });
    
    let queryResults;
    let contacts=[];

exports.handler = async (event,context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    const contacts = [{
        firstName:'Mehdi',
        lastName:'Benyebka',
        email:'mehdib030@gmail.com'
    }];
    
    const signedURLs = {
        url:'zodiac-signed-url'
    }

     let subject;
     let requestUuid;
     let result='';
    
     
    if( event.Records){
         console.log('EVENTS RECORDS : ',event.Records);
         for (const { messageId, eventSource, messageAttributes, body } of event.Records) {
            console.log('SQS message %s: %j', messageId, eventSource);
              subject = 'Message From Zodiac: Your request has been successfully completed.'
             console.log('******* Message attributes : ',messageAttributes);
             
             let message =''
            
             if(Object.keys(messageAttributes).length > 0){
                 
                 console.log("**** Publishing message complete.");
                 // console.log('******* Message Body : ',body);
                 
                 console.log('Request UUID = ',messageAttributes.requestUuid.stringValue);
                 console.log('Request status = ',messageAttributes.requestStatus.stringValue);
                 requestUuid = messageAttributes.requestUuid.stringValue;
                 
                
                 
                  let keys = JSON.parse(body);
                  for(const key of keys){
                      //console.log('## key : ',key);
                      const signedUrl = s3.getSignedUrl("getObject", {
                        Key: key,
                        Bucket: 'bucket2-team5',
                       // Expires: expires || 900, // S3 default is 900 seconds (15 minutes)
                      });
                      message += signedUrl + '\n'
                      //console.log('**Signed url :',signedUrl);
                  }
                  let contactSql = `UPDATE request SET status = 'complete' where uuid = '${requestUuid}';select * from contact;`
                 
                 
                  let res =  await executeQuery (contactSql, mysql, function(err,data){
                     let contacts=[]
                       if(err){
                           console.log('Error:', err);
                       } else {
                            console.log('Resulsts from DB: ', data);
                           // contacts = data[0];
                            
                             console.log("THE CONTACT FROM DB = ",data);
                            /* publishEmail(subject,message,callback,requestUuid).then(
                                    data => {
                                        console.log('EUREKA!');
                                   //  console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                                    console.log("MessageID is " + data.MessageId);
                                }
                                ).catch((error) => {
                                    console.log('Error:', error);
                                });;*/
                                                   }
                      return data;
                   });
                   
                 console.log("############# RESULTS = ",res);
                   
             await  publishEmail(subject,message,callback,requestUuid); 
        
             }
        }
        
        
        
   } else {
         if(event.source === 'aws.s3'){
            console.log('Event Source = ', event.source);
            subject = 'Message from Zodiac: Your request has been received.';
            let message = "We have received your request and are actively working on it! \n You will receive an email once your request has been successfully processed.";
            await publishEmail(subject, message);
         } 
    }
  
    
    
     console.log('THE EMAIL MESSAGE IS : ',subject);
     
   //  return 'Response from Notifications Lambda.';
};

 async function  publishEmail(subject, message,callback,requestUuid) {
    console.log('SENDING MESSAGE TO SNS : ',subject);
      console.log("*********** Contacts = ", queryResults)
      // Create publish parameters
    var params = {
      Message: message, /* required */
      Subject: subject ,
      TopicArn: 'arn:aws:sns:us-east-1:714230090472:zodiacSNS',
      MessageAttributes: {
        "emails": {
             DataType: "String.Array",
             StringValue: "[\"mehdib030@gmail.com\"]"
          }
      }
    };

    // Create promise and SNS service object ,\"ehale063@gmail.com\"
  
   let publishTextPromise  = await sns.publish(params).promise()
   /*.then(
        data => {
         console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
        console.log("MessageID is " + data.MessageId);
    }
    ).catch((error) => {
        console.log('Error:', error);
    });*/
    
   
    
    // if(result == 'success'){
         //  console.log("Connecting to Zodiac ...");
     
   //  console.log('SQL : ',sql);
  // setTimeout(publishEmail,5000);

  
  //   }
    
    return publishTextPromise;
}

async function publishRequestComplete(subject, message,requestUuid){
    console.log('SENDING MESSAGE COMPLETE TO SNS : ');
      // Create publish parameters
    var params = {
      Message: 'THIS IS A MESSAGE FROM NOTIFICATION LAMBDA', /* required */
      Subject: 'REQUEST COMPLETE' ,
      TopicArn: 'arn:aws:sns:us-east-1:714230090472:zodiacComplete',
      MessageAttributes: {
        "requestUuid": {
             DataType: "String",
             StringValue: requestUuid
          }
      }
    };

    // Create promise and SNS service object ,\"ehale063@gmail.com\"
        console.log('SNS PARAMS = ',params);
  
   let publishTextPromise  =  await sns.publish(params).promise().then(
        data => {
         console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
        console.log("MessageID is " + data.MessageId);
    }
    ).catch((error) => {
        console.log('Error:', error);
    });
    
   
    
    // if(result == 'success'){
         //  console.log("Connecting to Zodiac ...");
     
   //  console.log('SQL : ',sql);
  // setTimeout(publishEmail,5000);

  
  //   }
    
    return 'success';
}
const UpdateRequest = (requestUuid, callback) => {
    let sql = `UPDATE request SET status = 'complete' where uuid = '${requestUuid}';`
    
     executeQuery(sql, mysql, callback);
}

function executeQuery (sql, mysql, callback)  {
    
    
     console.log("Connecting to Zodiac ...");
     
     console.log('SQL : ',sql);

  /*  var connection = await mysql.createConnection({

        host: "cloudchallengezodiac.cmeewp1aqck4.us-east-1.rds.amazonaws.com",
        
        port: "3307",

        user: "cloudZodiac",

        password: "zodiacTeam5",

        database: "cloudChallengeZodiac",

    });*/
    
  
   console.log('2AFTER CONNECTION STATUS : ',connection.state);
    
    connection.query(sql,  (error, results, fields) => {
  

          console.log("Inside Query call ... ");
          
          let qr;

        if (error) {
            
            
            console.log("Error ... ");

            connection.destroy();

            throw error;

        } else {

            // connected!

            console.log("Query result:");

            console.log(results);
            
           console.log('JSON results = ', JSON.stringify(results));
           /*   const response = {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                    },
                    body: JSON.stringify(results),
                };*/

            callback(null,  JSON.stringify(results));

             connection.end(function (err) { callback(err, results);});
            
            queryResults =JSON.stringify(results);
            qr = JSON.stringify(results); 

        }
       return qr;
    });

}

function sendMessage(requestUuid){
    console.log('Sending message Complete to Request queue ...')
    //console.log('*** keys : ', JSON.stringify(keys))
var params = {
   // Remove DelaySeconds parameter and value for FIFO queues
  //DelaySeconds: 0,
  MessageAttributes: {
    "requestUuid": {
      DataType: "String",
      StringValue: requestUuid
    },
    "requestStatus": {
         DataType: "String",
         StringValue: "complete"
    }
  },
  MessageBody: 'The request has been completed.', //JSON.stringify(keys),
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/714230090472/zodiac-request-queue"
};
 console.log('***** Sending the message ...')
sqs.sendMessage(params).promise().then(resp => {
    console.log("THE NOTIFICATION LAMBDA RESPONSE = ",resp);
});

 console.log("Success: Message Sent.");
 
 return 'success';
 
}

