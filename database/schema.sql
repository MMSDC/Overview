DROP DATABASE IF EXISTS overview_db;

CREATE DATABASE overview_db;

USE overview_db;

CREATE TABLE products (
  id INTEGER AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(255) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  category VARCHAR(255) NOT NULL,
  default_price VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE styles (
  style_id INTEGER AUTO_INCREMENT,
  id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  sale_price VARCHAR(255) DEFAULT NULL,
  original_price INTEGER NOT NULL,
  default_style TINYINT DEFAULT 0 NOT NULL,
  PRIMARY KEY (style_id),
  FOREIGN KEY (id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE photos (
  id INTEGER AUTO_INCREMENT,
  photo_id INTEGER,
  style_id INTEGER NOT NULL,
  url VARCHAR(2048) NOT NULL,
  thumbnail_url VARCHAR(2048) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (style_id) REFERENCES styles(style_id) ON DELETE CASCADE
);

CREATE TABLE skus (
  sku_id INTEGER AUTO_INCREMENT,
  style_id INTEGER NOT NULL,
  size VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  PRIMARY KEY (sku_id),
  FOREIGN KEY (style_id) REFERENCES styles(style_id) ON DELETE CASCADE
);

CREATE TABLE features (
  feature_id INTEGER AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  feature VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY (feature_id),
  FOREIGN KEY (product_id) REFERENCES products(id)  ON DELETE CASCADE
);

