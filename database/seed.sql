LOAD DATA INFILE  '/Users/shayrosner/Code/Overview/data/product.csv'
INTO TABLE Product
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 12 ROWS;