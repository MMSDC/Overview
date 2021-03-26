var mysql = require('mysql');
var mysqlConfig = require('./config.js');
var helpers = require('./helpers.js');

var connection = mysql.createConnection(mysqlConfig);
// limit and offset(how many to drop)
const getAllProducts = (page, count) => {
  const productsQuery = `SELECT * FROM products LIMIT ${count} OFFSET ${(page - 1) * count}`;
  const promiseProducts = new Promise((resolve, reject) => {
    connection.query(productsQuery, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
  return promiseProducts;
}

const getOneProduct = (id) => {
  const oneProductQuery = `
  SELECT
    products.id,
    products.name,
    products.slogan,
    products.description,
    products.category,
    products.default_price,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'feature', features.feature,
      'value', features.value
    )
  )
  AS features
  FROM products
  JOIN features ON products.id=features.product_id
  WHERE products.id=?`;
  const promiseOneProduct = new Promise((resolve, reject) => {
    connection.query(oneProductQuery, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(helpers.parseProduct(row[0]));
      }
    })
  })
  return promiseOneProduct;
}

const getProductStyles = (id) => {
  const stylesQuery = `
  SELECT
    styles.style_id,
    styles.name,
    styles.sale_price,
    styles.original_price,
    styles.default_style,
    subphoto.photos,
    subsku.skus
    FROM styles
  JOIN (
    SELECT
    pl.style_id,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'thumbnail_url', pl.thumbnail_url,
        'url', pl.url
      )
    ) AS photos
    FROM photos AS pl
    WHERE style_id IN (SELECT style_id FROM styles WHERE id=?)
    GROUP by pl.style_id
  ) AS subphoto
  ON subphoto.style_id = styles.style_id
  JOIN (
    SELECT
    sl.style_id,
    JSON_OBJECTAGG(
      sl.sku_id,
        JSON_OBJECT(
          'quantity', sl.quantity,
          'size', sl.size
        )
    ) AS skus
    FROM skus AS sl
    WHERE sl.style_id IN (SELECT style_id FROM styles WHERE id=?)
    GROUP by sl.style_id
  ) AS subsku
  ON subsku.style_id = styles.style_id
  WHERE styles.id=?`;
  const promiseStyles = new Promise((resolve, reject) => {
    connection.query(stylesQuery, [id, id, id], (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsedData = helpers.parseStyles(data)
        resolve(parsedData);
      }
    })
  })
  return promiseStyles;
}

module.exports.getAllProducts = getAllProducts;
module.exports.getOneProduct = getOneProduct;
module.exports.getProductStyles = getProductStyles;