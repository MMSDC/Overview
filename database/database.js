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

//  EXPLAIN ANALYZE
const getOneProduct = (id) => {
  const oneProductQuery = `
  SELECT
    products.product_id,
    products.name,
    products.slogan,
    products.description,
    products.category,
    products.default_price,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'id', features.product_id,
      'feature', features.feature,
      'value', features.value
    )
  )
  AS features
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
  SELECT
    styles.style_id,
    styles.product_id,
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
        'url', pl.url,
        'thumbnail_url', pl.thumbnail_url
      )
    ) AS photos
    FROM photos AS pl
    WHERE style_id=46609
    GROUP by pl.style_id
  ) AS subphoto
  ON subphoto.style_id = styles.style_id
  JOIN (
    SELECT
    sl.style_id,
    JSON_OBJECTAGG(
      sl.sku_id,
        JSON_OBJECT(
          'size', sl.size,
          'quantity', sl.quantity
        )
    ) AS skus
    FROM skus AS sl
    WHERE sl.style_id =46609
    GROUP by sl.style_id
  ) AS subsku
  ON subsku.style_id = styles.style_id
  WHERE styles.product_id=?`;
  const promiseStyles = new Promise((resolve, reject) => {
    connection.query(stylesQuery, [id], (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log('data', JSON.stringify(data[0].default_style))
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

/**
 * const stylesQuery = `
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
 */

  /*
  SELECT
    st.id,
    st.product_id,
    st.name,
    st.sale_price,
    st.original_price,
    st.default_style,
    subphoto.photos,
    subsku.skus
  from styles as st
  join (
    select
    pl.style_id,
    jsonb_agg (
        json_build_object(
        'thumbnail_url', pl.thumbnail_url,
        'url', pl.photo_url
        )
    ) as photos
    from photo_list as pl
    where style_id = st.id
    group by pl.style_id
  ) as subphoto
  on subphoto.style_id = st.id
  join (
    SELECT
    sl.style_id,
    json_object_agg(
    sl.id,
        json_build_object(
            'size', sl.size,
            'quantity',sl.quantity
        )
    ) as skus
    from sku_list as sl
    where sl.style_id = 84407
    group by sl.style_id
  ) as subsku
  on subsku.style_id = st.id
  where product_id = 18081;
  */
//this
  /**
   * SELECT
    styles.style_id,
    styles.product_id,
    styles.name,
    styles.sale_price,
    styles.original_price,
    styles.default_style,
    subphoto.photos
    FROM styles
  JOIN (
    SELECT
    pl.style_id,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'url', pl.url,
        'thumbnail_url', pl.thumbnail_url
      )
    ) AS photos
    FROM photos AS pl
    WHERE style_id=46609
    GROUP by pl.style_id
  ) AS subphoto
  ON subphoto.style_id = styles.style_id
  JOIN (
    SELECT
    sl.style_id,
    JSON_OBJECTAGG(
      sl.sku_id,
        JSON_OBJECT(
          'size', sl.size,
          'quantity', sl.quantity
        )
    ) AS skus
    FROM skus AS sl
    WHERE sl.style_id =46609
    GROUP by sl.style_id
  ) AS subsku
  ON subsku.style_id = styles.style_id
  WHERE styles.product_id=10000
  `
   */