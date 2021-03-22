LOAD DATA INFILE  '/Users/shayrosner/Code/Overview/data/product.csv'
INTO TABLE Product
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 12 ROWS;
-- //

LOAD DATA INFILE  '/Users/shayrosner/Code/Overview/data/features.csv'
INTO TABLE Features
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 31 ROWS;
-- 31,12,"Cut","Skinny"//

LOAD DATA INFILE  '/Users/shayrosner/Code/Overview/data/styles.csv'
INTO TABLE Styles
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 53 ROWS;
-- 53,12,"Green",null,350,1//

LOAD DATA INFILE  '/Users/shayrosner/Code/Overview/data/skus.csv'
INTO TABLE Skus
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 358 ROWS;
-- 358,53,"XS",14//

LOAD DATA INFILE  '/Users/shayrosner/Code/Overview/data/photos.csv'
INTO TABLE Photo
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 296 ROWS;
-- //