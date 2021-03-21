const express = require('express');
const productController = require('../controller/controller.js')

const app = express();

const port = 3300;


app.use(express.json());
// GET /products
app.get('/products', productController.getAllProducts)

// GET /products/:product_id
app.get('/products/:id', productController.getOneProduct)

// GET /products/:product_id/styles
app.get('/products/:id/styles', productController.getProductStyles)

// GET /products/:product_id/related
// app.get('/products/:id/related', (req, res) => {
//   res.send('hi')
// })

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})