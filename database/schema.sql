DROP DATABASE IF EXISTS overview_db;

CREATE DATABASE overview_db;

USE overview_db;

CREATE TABLE Product (
  product_id INTEGER AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  default_price INTEGER NOT NULL,
  PRIMARY KEY (product_id)
);

CREATE TABLE Features (
  feature_id INTEGER AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  feature VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY (feature_id),
  FOREIGN KEY (product_id) REFERENCES Product(product_id)  ON DELETE CASCADE
);

CREATE TABLE Related_Product (
  related_id INTEGER NOT NULL,
  PRIMARY KEY (related_id)
);

CREATE TABLE Related_Products (
  related_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  FOREIGN KEY (related_id) REFERENCES Related_Product(product_id)  ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

CREATE TABLE Styles (
  style_id INTEGER AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  original_price INTEGER NOT NULL,
  sale_price INTEGER NOT NULL,
  default_style BOOLEAN,
  PRIMARY KEY (style_id),
  FOREIGN KEY (product_id) REFERENCES Product(product_id) ON DELETE CASCADE
);

CREATE TABLE Photo (
  photo_id INTEGER AUTO_INCREMENT,
  url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL,
  PRIMARY KEY (photo_id)
);

CREATE TABLE Photos (
  photo_id INTEGER NOT NULL,
  style_id INTEGER NOT NULL,
  FOREIGN KEY (photo_id) REFERENCES Photo(photo_id) ON DELETE CASCADE,
  FOREIGN KEY (style_id) REFERENCES Styles(style_id) ON DELETE CASCADE
);

CREATE TABLE Skus (
  sku_id INTEGER AUTO_INCREMENT,
  style_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  size VARCHAR(255) NOT NULL,
  PRIMARY KEY (sku_id),
  FOREIGN KEY (style_id) REFERENCES Styles(style_id) ON DELETE CASCADE
);

CREATE TABLE Cart_Item (
  cart_id INTEGER AUTO_INCREMENT,
  quantity INTEGER NOT NULL,
  PRIMARY KEY (cart_id),
  FOREIGN KEY (sku_id) REFERENCES Sku(sku_id)  ON DELETE CASCADE,
)
