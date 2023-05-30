CREATE TABLE IF NOT EXISTS personal_info (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(10) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS home_address (
    homeid INT AUTO_INCREMENT PRIMARY KEY,
    address1 VARCHAR(100) NOT NULL,
    address2 VARCHAR(100), 
    town VARCHAR(50) NOT NULL, 
    county VARCHAR(50) NOT NULL,
    eircode VARCHAR(10),
    personal_id int not null,
    FOREIGN KEY (personal_id) REFERENCES personal_info(id)
);

CREATE TABLE IF NOT EXISTS shipping_address (
    shipid INT AUTO_INCREMENT PRIMARY KEY,
    address1 VARCHAR(100) NOT NULL,
    address2 VARCHAR(100), 
    town VARCHAR(50) NOT NULL, 
    county VARCHAR(50) NOT NULL,
    eircode VARCHAR(10),
    personal_id int not null,
    FOREIGN KEY (personal_id) REFERENCES personal_info(id)
);
