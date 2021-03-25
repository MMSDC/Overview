const fs = require('fs');
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
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
      {id: 'id', title: 'id'},
      {id: 'name', title: 'name'},
      {id: 'slogan', title: 'slogan'},
      {id: 'description', title: 'description'},
      {id: 'category', title: 'category'},
      {id: 'default_price', title: 'default_price'}
  ]
});

const processProduct = async() => {
  let data = []
  const parser = fs.createReadStream('./data/product.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    const id = `${row.id}`
    const name = `${row[" name"]}`
    const slogan = `${row[" slogan"]}`
    const description = `${row[" description"]}`
    const category = `${row[" category"]}`
    let default_price = `${row[" default_price"]}`
    //^beginning, /d=digit, +=1or more of $=end
    const reg = /^\d+$/;
    if (reg.test(default_price)) {
      try {
        if (data.length < 1000) {
            data.push([id, name, slogan, description, category, default_price])
        } else {
          const res = await insertProducts(data)
          console.log('res', res)
          data = [[id, name, slogan, description, category, default_price]];
        }
      } catch(error) {console.error(error)}
    } else {
      if (default_price.startsWith(' ')) {
        default_price = default_price.slice(1)
        if (!isNaN(default_price)) {
          cleanRow = {id, name, slogan, description, category, default_price}
          await csvWriter.writeRecords([cleanRow])
        }
      } else if (default_price.startsWith('"default_price": ')) {
        const splitPrice = default_price.split(' ');
        default_price = splitPrice[1];
        const cleanRow = {id, name, slogan, description, category, default_price}
        await csvWriter.writeRecords([cleanRow])
      }
    }
  }
  const leftoverRes = await insertProducts(data)
  console.log(leftoverRes)
}

const processCleanProduct = async() => {
  const parser = fs.createReadStream('./data/product-clean.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    const id = `${row.id}`
    const name = `${row.name}`
    const slogan = `${row.slogan}`
    const description = `${row.description}`
    const category = `${row.category}`
    const default_price = `${row.default_price}`
    const cleanPrice = default_price.trim()
    await insertProducts([[id,name,slogan,description,category,cleanPrice]])
  }
}

const insertProducts = (data) => {
  const productQuery = `INSERT INTO products (id,name,slogan,description,category,default_price) VALUES ?`
  const promise = new Promise((resolve, reject) => {
    connection.query(productQuery, [data], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promise;
};

const processStyle = async() => {
  let data = [];
  const parser = fs.createReadStream('./data/styles.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    const style_id = `${row.id}`
    const id = `${row.productId}`
    const name = `${row.name}`
    const sale_price = `${row.sale_price}`
    const original_price = `${row.original_price}`
    const default_style = `${row.default_style}`
    try{
      if (data.length < 1000) {
        data.push([style_id, id, name, sale_price, original_price, default_style])
      } else {
        const styRes = await insertStyles(data)
        console.log('styRes', styRes)
        data = [[style_id, id, name, sale_price, original_price, default_style]];
      }
    } catch(error) {
      console.error(error)
    }
  }
  const leftoverRes = await insertStyles(data)
  console.log(leftoverRes)
}

const insertStyles = (data) => {
  const stylesQuery = `INSERT INTO styles (style_id,id,name,sale_price,original_price,default_style) VALUES ?`
  const promise = new Promise((resolve, reject) => {
    connection.query(stylesQuery, [data], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promise;
};

const processPhotos = async() => {
  let data = [];
  const parser = fs.createReadStream('./data/photos.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    const photo_id = `${row.id}`
    const style_id = `${row[' styleId']}`
    const url = `${row[' url']}`
    const thumbnail_url = `${row[' thumbnail_url']}`
    try{
        if (data.length < 1000) {
          data.push([photo_id, style_id, url, thumbnail_url])
        } else {
          const photRes = await insertPhotos(data)
          console.log('photRes', photRes)
          data = [[photo_id, style_id, url, thumbnail_url]];
        }
    } catch(error) {
      console.error(error);
    }
  }
  const leftoverRes = await insertPhotos(data)
  console.log(leftoverRes)
}

const insertPhotos = (data) => {
  const photosQuery = `INSERT INTO photos (photo_id, style_id, url, thumbnail_url) VALUES ?`
  const promise = new Promise((resolve, reject) => {
    connection.query(photosQuery, [data], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promise;
};

const processSkus = async() => {
  let data = [];
  const parser = fs.createReadStream('./data/skus.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    const sku_id = `${row.id}`
    const style_id = `${row[' styleId']}`
    const size = `${row[' size']}`
    const quantity = `${row[' quantity']}`
    try{
      if (data.length < 1000) {
        data.push([sku_id, style_id, size, quantity])
      } else {
        const skuRes = await insertSkus(data)
        console.log('skuRes', skuRes)
        data = [[sku_id, style_id, size, quantity]];
      }
    } catch(error) {
      console.error(error);
    }
  }
  const leftoverRes = await insertSkus(data)
  console.log('leftoverRes', leftoverRes)
}

const insertSkus = (data) => {
  const skusQuery = `INSERT INTO skus (sku_id, style_id, size, quantity) VALUES ?`
  const promise = new Promise((resolve, reject) => {
    connection.query(skusQuery, [data], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promise;
};

// 2218658
const processFeatures = async() => {
  let data = [];
  const parser = fs.createReadStream('./data/features.csv')
  .pipe(csv({}));
  for await (const row of parser) {
    const feature_id = `${row.id}`
    const product_id = `${row.product_id}`
    const feature = `${row.feature}`
    const value = `${row.value}`
    try {
      if (data.length < 1000) {
        data.push([feature_id, product_id, feature, value])
      } else {
        const featRes = await insertFeatures(data)
        console.log('featRes', featRes)
        // console.log('else style_id', style_id)
        // console.log('else product_id', style_id)
        data = [[feature_id, product_id, feature, value]];
      }
    } catch (error) {
      console.error(error);
    }
  }
  const leftoverRes = await insertFeatures(data)
  console.log('leftoverRes', leftoverRes)
}

const insertFeatures = (data) => {
  const featQuery = `INSERT INTO features (feature_id, product_id, feature, value) VALUES ?`
  const promise = new Promise((resolve, reject) => {
    connection.query(featQuery, [data], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
  return promise;
};

(async () => {
  await processProduct()
  await processCleanProduct()
  await processStyle()
  await processPhotos()
  await processSkus()
  await processFeatures()
  // await processRelated()
})()

// // // 4510017
// const processRelated = async() => {
//   let data = [];
//   const parser = fs.createReadStream('./data/related.csv')
//   .pipe(csv({}));
//   for await (const row of parser) {
//     const relatedProduct_id = `${row.id}`
//     const product_id = `${row.current_product_id}`
//     const related_id = `${row.related_product_id}`
//     try{
//       if (data.length < 1000) {
//         data.push([relatedProduct_id, product_id, related_id])
//       } else {
//         const relatRes = await insertRelated(data)
//         console.log('relatRes', relatRes)
//         data = [[relatedProduct_id, product_id, related_id]];
//       }
//     } catch(error) {
//       console.error(error);
//     }
//   }
//   const leftoverRes = await insertRelated(data)
//   console.log('leftoverRes', leftoverRes)
// }

// // 2218658
// const insertRelated = (data) => {
//   const featQuery = `INSERT INTO related_products (product_id, related_id) VALUES ?`
//   const promise = new Promise((resolve, reject) => {
//     connection.query(featQuery, [data], (err, rows) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     })
//   })
//   return promise;
// };

// (async () => {
//   await processProduct()
//   await processCleanProduct()
//   await processStyle()
//   await processPhotos()
//   await processSkus()
//   await processFeatures()
//   // await processRelated()
// })()


// CREATE TABLE related_products (
//   id INTEGER AUTO_INCREMENT,
//   product_id INTEGER NOT NULL,
//   related_id INTEGER NOT NULL,
//   PRIMARY KEY (id),
//   UNIQUE (product_id, related_id),
//   FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
//   FOREIGN KEY (related_id) REFERENCES products(id)  ON DELETE CASCADE
// );

// CREATE TABLE cart_item (
//   cart_id INTEGER AUTO_INCREMENT,
//   sku_id INTEGER NOT NULL,
//   quantity INTEGER NOT NULL,
//   PRIMARY KEY (cart_id),
//   FOREIGN KEY (sku_id) REFERENCES skus(sku_id)  ON DELETE CASCADE
// )

//mysql -u root -p < schema.sql;