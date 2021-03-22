const fs = require('fs');
const csv = require('csv-parser')
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

const processFile = async() => {
  const parser = fs.createReadStream('./data/product.csv')
  .pipe(csv({
    // CSV options if any
    // tried trim here but didnt work
  }));
  for await (const row of parser) {
    const id = `${row.id}`
    const name = `${row[" name"]}`
    const slogan = `${row[" slogan"]}`
    const description = `${row[" description"]}`
    const category = `${row[" category"]}`
    const default_price = `${row[" default_price"]}`
    if(typeof default_price === 'number') {
      try{
        await insertProducts([id,name,slogan,description,category,default_price])
      } catch(error) {console.error(error)}
    }
  }
}

const insertProducts = (data) => {
  const productQuery = `INSERT INTO Product (id,name,slogan,description,category,default_price) VALUES (?, ?, ?, ?, ?, ?)`
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
// invokes processFile immediately
(async () => {
  const records = await processFile()
  console.info('records', records);
})()



//mysql -u root -p < schema.sql