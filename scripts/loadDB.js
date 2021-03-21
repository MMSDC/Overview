const fs = require('fs');
const csv = require('csv-parser')
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mysql = require('mysql')
const mysqlConfig = require('../database/config.js');

const connection = mysql.createConnection(mysqlConfig);

connection.connect((error) => {
  if (error) {
    console.log(error)
  } else {
    console.log("MySQL Connected...")
  }
})

// const neatCsv = require('neat-csv');

const csvWriter = createCsvWriter({
  path: './data/product-clean.csv',
  header: [
    // id, name, slogan, description, category, default_price
      {id: 'product_id', title: 'product_id'},
      {id: 'name', title: 'name'},
      {id: 'slogan', title: 'slogan'},
      {id: 'description', title: 'description'},
      {id: 'category', title: 'category'},
      {id: 'default_price', title: 'default_price'}
  ]
});

const processProduct = async() => {
  const parser = fs.createReadStream('./data/product.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    const product_id = `${row.id}`
    const name = `${row[" name"]}`
    const slogan = `${row[" slogan"]}`
    const description = `${row[" description"]}`
    const category = `${row[" category"]}`
    const default_price = `${row[" default_price"]}`
    const reg = /^\d+$/;
    if (reg.test(default_price)) {
      try{
        const res = await insertProducts([product_id,name,slogan,description,category,default_price])
        console.log('res', res)
      } catch(error) {console.error(error)}
    } else {
        const cleanRow = {product_id, name, slogan, description, category, default_price}
      await csvWriter.writeRecords([cleanRow])
    }
  }
}

const processCleanProduct = async() => {
  const parser = fs.createReadStream('./data/product-clean.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    // console.log('clean row', row)
    const product_id = `${row.product_id}`
    const name = `${row.name}`
    const slogan = `${row.slogan}`
    const description = `${row.description}`
    const category = `${row.category}`
    const default_price = `${row.default_price}`
    const cleanPrice = default_price.trim()
    // console.log('typeof cleanPrice', typeof cleanPrice)
    const smallRes = await insertProducts([product_id,name,slogan,description,category,cleanPrice])
    console.log('smallRes', smallRes)
  }
}

const insertProducts = (data) => {
  const productQuery = `INSERT INTO Product (product_id,name,slogan,description,category,default_price) VALUES (?, ?, ?, ?, ?, ?)`
  const promise = new Promise((resolve, reject) => {
    connection.query(productQuery, data, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promise;
};
// invokes processProduct immediately
(async () => {
  const records = await processProduct()
  const cleanRecords = await processCleanProduct()
  console.info('records', records);
  console.info('cleanRecords', cleanRecords);
})()

const processStyle = async() => {
  const parser = fs.createReadStream('./data/styles.csv')
  .pipe(csv({
    // CSV options if any
    // tried trim here but didnt work
  }));
  for await (const row of parser) {
    const style_id = `${row.id}`
    const product_id = `${row.productId}`
    const name = `${row.name}`
    const sale_price = `${row.sale_price}`
    const original_price = `${row.original_price}`
    const default_style = `${row.default_style}`
      try{
        const styRes = await insertStyles([style_id,product_id,name,sale_price,original_price,default_style])
        console.log('styRes', styRes)
      } catch(error) {console.error(error)}
  }
}
(async () => {
  const records = await processStyle()
  console.info('records', records);
})()

const insertStyles = (data) => {
  const stylesQuery = `INSERT INTO Styles (style_id,product_id,name,sale_price,original_price,default_style) VALUES (?, ?, ?, ?, ?, ?)`
  const promise = new Promise((resolve, reject) => {
    connection.query(stylesQuery, data, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promise;
};

//mysql -u root -p < schema.sql