INSERT INTO `cloudChallengeZodiac`.`requestor`
(
`first_name`,
`last_name`,
`email`)
VALUES
(
'John',
'Lucas',
'jl@hotmail.com');

SET @requestor_id = LAST_INSERT_ID();

INSERT INTO `cloudChallengeZodiac`.`contact`
(
`firstName`,
`lastName`,
`email`,
`requestor_requestor_id`)
VALUES
(
'Bob',
'Dylan',
'bd@gmail.com',
@requestor_id);
SET @contact_id = LAST_INSERT_ID();

INSERT INTO `cloudChallengeZodiac`.`request`
(
`request_uuid`,
`status`)
VALUES
('122-24rwq-4214',
'Received');
SET @request_id = LAST_INSERT_ID();

INSERT INTO `cloudChallengeZodiac`.`request_contact`
(
`request_request_id`,
`contact_contact_id`)
VALUES
(
 @request_id,
 @contact_id
 );


