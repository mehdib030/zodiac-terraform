const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event) => {
  if (!event && !event.body) {
    throw new Error('No payload has been received');
  }

  const body = JSON.parse(event.body);
  const now = Date.now();
  

  if (!body.username) {
    throw new Error('Invalid payload');
  }
  
  if (!body.filename) {
    throw new Error('Invalid payload');
  }

  const params = {
    Bucket: 'bucket2-team5',
    Key: `famous_people/${body.username}/${body.uuid}/${body.filename}`,
    Expires: 900,
    ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  try {
    const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
    console.log('The presigned URL is:', presignedUrl);

  const response = {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                    },
                    body: JSON.stringify(presignedUrl)
                };
    return response;
  } catch (error) {
    console.error('Error while generating presigned URL:', error.message);
    throw new Error(error);
  }
};

