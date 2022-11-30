INSERT INTO `cloudChallengeZodiac`.`registration`
(
`first_name`,
`last_name`
)
VALUES
(
'John',
'Doee'
);
CREATE DATABASE `cloudChallengeZodiac` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `contact` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `effective_date` varchar(45) DEFAULT NULL,
  `expiration_date` varchar(45) DEFAULT NULL,
  `requestor_requestor_id` int NOT NULL,
  PRIMARY KEY (`contact_id`),
  KEY `contact_requestor_id_idx` (`requestor_requestor_id`),
  CONSTRAINT `contact_requestor_id` FOREIGN KEY (`requestor_requestor_id`) REFERENCES `requestor` (`requestor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `email` (
  `emailId` int NOT NULL AUTO_INCREMENT,
  `address` varchar(45) DEFAULT NULL,
  `contact_contact_id` int NOT NULL,
  PRIMARY KEY (`emailId`),
  KEY `email_contact_fk1_idx` (`contact_contact_id`),
  CONSTRAINT `email_contact_fk1` FOREIGN KEY (`contact_contact_id`) REFERENCES `contact` (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `flyer` (
  `flyer_id` int NOT NULL AUTO_INCREMENT,
  `flyer_key` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`flyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `person` (
  `famous_person_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `dob` varchar(45) DEFAULT NULL,
  `zodiac` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`famous_person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `registration` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `effectiveDate` date DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  PRIMARY KEY (`registration_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `requestor_requestor_id` int NOT NULL,
  PRIMARY KEY (`request_id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  KEY `requestor_fk1_idx` (`requestor_requestor_id`),
  CONSTRAINT `requestor_fk1` FOREIGN KEY (`requestor_requestor_id`) REFERENCES `requestor` (`requestor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `request_contact` (
  `request_contact_id` int NOT NULL AUTO_INCREMENT,
  `request_request_id` int NOT NULL,
  `contact_contact_id` int NOT NULL,
  PRIMARY KEY (`request_contact_id`),
  KEY `contact_fk2_idx` (`contact_contact_id`),
  KEY `request_contact_fk1_idx` (`request_request_id`),
  CONSTRAINT `request_contact_fk1` FOREIGN KEY (`request_request_id`) REFERENCES `request` (`request_id`),
  CONSTRAINT `request_contact_fk2` FOREIGN KEY (`contact_contact_id`) REFERENCES `contact` (`contact_id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `request_flyer` (
  `request_flyer_id` int NOT NULL AUTO_INCREMENT,
  `request_request_id` int NOT NULL,
  `flyer_flyer_id` int NOT NULL,
  PRIMARY KEY (`request_flyer_id`),
  KEY `request_flyer_fk1_idx` (`request_request_id`),
  KEY `request_flyer_fk2_idx` (`flyer_flyer_id`),
  CONSTRAINT `request_flyer_fk1` FOREIGN KEY (`request_request_id`) REFERENCES `request` (`request_id`),
  CONSTRAINT `request_flyer_fk2` FOREIGN KEY (`flyer_flyer_id`) REFERENCES `flyer` (`flyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `request_person` (
  `request_person_id` int NOT NULL AUTO_INCREMENT,
  `request_request_id` int NOT NULL,
  `person_person_id` int NOT NULL,
  PRIMARY KEY (`request_person_id`),
  KEY `request_person_fk2_idx` (`person_person_id`),
  KEY `request_person_fk1_idx` (`request_request_id`),
  CONSTRAINT `request_person_fk1` FOREIGN KEY (`request_request_id`) REFERENCES `request` (`request_id`),
  CONSTRAINT `request_person_fk2` FOREIGN KEY (`person_person_id`) REFERENCES `person` (`famous_person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `requestor` (
  `requestor_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`requestor_id`),
  UNIQUE KEY `requestor_id_UNIQUE` (`requestor_id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `status` (
  `idStatus` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SET @registration_id = LAST_INSERT_ID();
