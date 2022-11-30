const { PDFDocument, rgb, degrees } =  require('pdf-lib');
const xlsxFile = require('read-excel-file/node')
const aws = require('aws-sdk');
const fs = require("fs");
const mysql = require('mysql');
var sqs = new aws.SQS({apiVersion: '2012-11-05'});
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

let keys = [];

console.log('Loading function');


exports.handler = async (event, context) => {
    console.log('ZODIAC PROCESS FILE, Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
   // const bucket = event.Records[0].s3.bucket.name;
   const bucket = event.detail.bucket.name;
   const key = decodeURIComponent(event.detail.object.key.replace(/\+/g, ' '));
   const requestUuid = key.split('/')[2];
   console.log('Request uuid = ',requestUuid);
   console.log('Bucket name = ',bucket);
    console.log('Key = ',key);
    const params = {
        Bucket: bucket,
        Key: key,
    };
    
    const schema = {
    
       'Person': {
            prop: 'Name',
            type: String
          },
       'Birthday': {
        // JSON object property name.
        prop: 'date',
        type: Date
      },
    }


    var persons;
    
      const data = await s3.getObject(params).promise();
       //console.log('CONTENT TYPE:', data);
        var workbook = await xlsxFile(data.Body, {schema}, { dateFormat: 'mm/dd/yyyy'}).then((rows) => {
         // console.log(rows);
            this.persons=rows;
            
        });
        
     //   console.log('DISPLAYING PERSONS = ',this.persons.rows[0].Name);
        
    //    console.log('DATE = ', this.persons.rows[0].date.toLocaleDateString());
        
     //    console.log('Month = ', this.persons.rows[0].date.getMonth());
    //     console.log('DAY = ', this.persons.rows[0].date.getDate());
         
         console.log('Rows array lenth = ',this.persons.rows.length);
    
       //  for(var i=0; i < this.persons.rows.length;i++){
            let response = await createFlyer(this.persons);
             //console.log('PERSON NAME = ',this.persons.rows[i].Name);
             //  console.log('PERSON DOB = ',this.persons.rows[i].date);
      //    }
    
      if(response == 'success'){
          console.log('Flyers processed successfully');
         await sendMessage(requestUuid);
      }
    return data.Body.toString('utf-8');
};

async function createFlyer(persons) {
      console.log('Creatting flyers ...');
    
      // Send receive message
    
    
    for(var i=0; i < persons.rows.length;i++){
        
     let   person =  persons.rows[i];
    
    let zodiacSign =  findZodiacSign(person.date.getDate(), person.date.getMonth());
   
  
    var bucket='bucket2-team5';
    var key='';
    
    key= `zodiacs/${zodiacSign}.pdf`;
    
  //  console.log('Key = ', key);
    
      const params = {
        Bucket: bucket,
        Key: key
    };
    
   // console.log('PARAMS = ',params);
    
    
    try{
    
   const existingPdfBytes  = await s3.getObject(params).promise();
   
   //console.log('PDF Bytes',existingPdfBytes);
    
    // Load an existing PDFDocument
   const pdfDoc = await PDFDocument.load(existingPdfBytes.Body);
   
   // Draw some text on the first page of the PDFDocument
    const page = pdfDoc.getPage(0);
   // page.drawText(`Name = ${person.Name}, Date Of Birth = ${person.date}`, {
   
 //  console.log('PDF HEIGHT = ',page.getHeight());
   
  // console.log('PDF Width = ',page.getWidth());
    page.drawText(`${person.Name}, \n Date Of Birth : ${person.date.getMonth()+1}/${person.date.getDate()}`, {
    //page.drawText("ZODIAC TEAM 5", {
      x: 10,
      y: page.getHeight() / 2 ,
      size: 8,
      color: rgb(0.95, 0.1, 0.1),
      //rotate: degrees(-45),
    });

    // Save the PDFDocument and write it to a file
    const pdfBytes = await pdfDoc.save();
    
    //console.log('PDF file save ...');
    
   // console.log('Flyer Key: `${zodiacSign}_${person.Name}_flyer.pdf`')
   
    await uploadPdfFile(pdfBytes,`${zodiacSign}_${person.Name}_flyer.pdf`)
     
 //  return pdfBytes;
     
    } catch(e){
      console.log('Error : ',e);
    }
    
    }
  // const data =  s3.getObject(params).promise();
  
  return 'success';
  
}

async function uploadPdfFile(data,filename){

  const buffer = Buffer.from(data);

  const params = {
    Bucket: "bucket2-team5",
    Key: `flyers/${filename}`,
    Body: buffer,
  };
  
   keys.push(`flyers/${filename}`);
  //console.log("Saving pdf to s3 ...");
  const res = await s3.putObject(params).promise();
  
  
 
  if(res){
    //  updateRequest(`flyers/${filename}`, requestId)
  }
 //console.log("Successfully uploaded", res);
 
   
  return "All good";
};

function findZodiacSign(day, month) {

  if((month == 0 && day <= 19) || (month == 11 && day >=22)) {
    return 'Capricorn';
  } else if ((month == 0 && day >= 20) || (month == 1 && day <= 18)) {
    return 'Aquarius';
  } else if((month == 1 && day >= 19) || (month == 2 && day <= 20)) {
    return 'Pisces';
  } else if((month == 2 && day >= 21) || (month == 3 && day <= 19)) {
    return 'Aries';
  } else if((month == 3 && day >= 20) || (month == 4 && day <= 20)) {
    return 'Taurus';
  } else if((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
    return 'Gemini';
  } else if((month == 5 && day >= 21) || (month == 6 && day <= 22)) {
    return 'Cancer';
  } else if((month == 6 && day >= 23) || (month == 7 && day <= 22)) {
    return 'Leo';
  } else if((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
    return 'Virgo';
  } else if((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
    return 'Libra';
  } else if((month == 9 && day >= 23) || (month == 10 && day <= 21)) {
    return 'Scorpio';
  } else if((month == 10 && day >= 22) || (month == 11 && day <= 21)) {
    return 'Sagittarius';
  }
}



async function sendMessage(requestUuid){
    console.log('Sending message Received to Notifications queue ...')
    console.log('*** keys : ', JSON.stringify(keys))
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
  MessageBody: JSON.stringify(keys),
  // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
  // MessageGroupId: "Group1",  // Required for FIFO queues
  QueueUrl: "https://sqs.us-east-1.amazonaws.com/714230090472/zodiac-notifications-queue-1"
};


   // "keys": this.keys,
    //"requestUUID":"eqwewr1123"

await sqs.sendMessage(params).promise().then(resp => {
    console.log("THE NOTIFICATION LAMBDA RESPONSE = ",resp);
});

/*sqs.sendMessage(params, function(err, data) {
     console.log('Sending message Received to Notifications queue parameters ...',params)
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.MessageId);
  }
});*/

 console.log("Success: Message Sent.");
}

function updateRequest(key, request_id){
     let sql = `insert into flyer (flyer_key) values ('${key}');
     SET @flyer_id = LAST_INSERT_ID();
     INSERT INTO request_flyer (request_request_id,contact_contact_id) VALUES (@flyer_id, ${request_id} );`;
        
    
    console.log("SQL = ", sql);
                
      executeQuery(sql, mysql, this.callback)
}

function executeQuery(sql, mysql, callback){
    
     console.log("Connecting to Zodiac ...");

    var connection = mysql.createConnection({

        host: "cloudchallengezodiac.cmeewp1aqck4.us-east-1.rds.amazonaws.com",
        
        port: "3307",

        user: "cloudZodiac",

        password: "zodiacTeam5",

        database: "cloudChallengeZodiac",

    });
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

}