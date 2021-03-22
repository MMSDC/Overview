var mysql = require('mysql');
var mysqlConfig = require('./config.js');

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
  SELECT products.product_id,  products.name, products.slogan, products.description, products.category, products.default_price,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'f_id', features.product_id,
      'f_feature', features.feature,
      'f_value', features.value)
  )
  AS feature_data
  FROM products
  JOIN features ON products.product_id=features.product_id
  WHERE products.product_id=?`;
  const promiseOneProduct = new Promise((resolve, reject) => {
    connection.query(oneProductQuery, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promiseOneProduct;
}

const getProductStyles = (id) => {
  const stylesQuery = `
  SELECT products.product_id,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      's_id', styles.style_id,
      's_name', styles.name,
      's_original_price', styles.original_price,
      's_sale_price', styles.sale_price,
      's_default', styles.default_style
    )
  )
  AS style_data
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'p_style_id', photos.style_id,
      'p_url', photos.url,
      'p_thumbnail_url', photos.thumbnail_url,
    )
  )
  AS photo_data
  FROM products
  JOIN styles ON products.product_id=styles.product_id
  JOIN skus ON styles.style_id=skus.style_id
  JOIN photos ON styles.style_id=photos.style_id
  WHERE products.product_id=?`;
  const promiseStyles = new Promise((resolve, reject) => {
    connection.query(stylesQuery, [id], (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data[0]);
      }
    })
  })
  return promiseStyles;
}

/*
  {
    product_id
    result :
      [{
        style_id, name, original_price, sale_price, default?,
        photos [{ thumbnail_url, url }],
        skus [sku_id { quantity, size }]
      }]
  }

  , JSON_ARRAYAGG( JSON_OBJECT( 's_id', styles.style_id, 's_name', styles.name, 's_original_price', styles.original_price, 's_sale_price', styles.sale_price, 's_default?', styles.default_style ) ) AS style

*/

module.exports.getAllProducts = getAllProducts;
module.exports.getOneProduct = getOneProduct;
module.exports.getProductStyles = getProductStyles;