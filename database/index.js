const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/overview_db');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  product_id: {
    type: Number,
    index: true
  },
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  related_products: [Number],
  features: [{ feature: String, value: String }],
  result : [{
    style_id: {
      type: Number,
      index: true
    },
    name: String,
    original_price: Number,
    sale_price: {
      type: Number,
      default: null
    },
    "default?": Boolean,
    photos: [{ thumbnail_url: String, url: String }],
    skus: {
      sku_id: {
        type: Number,
        index: true
      },
      quantity: Number,
      size: String
    }
  }]
})

// const cartSchema = new Schema({
//   cart: [{sku_id: Number, count: Number}]
// })

const Shirt = mongoose.model('Shirt', productSchema);

const camo = new Shirt({
  product_id: 14034,
  name: "Camo Onesie",
  slogan: "Blend in to your crowd",
  description: "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
  category: "Jackets",
  default_price: 140.00,
  related_products: [14035, 14036, 14041, 14040],
  features: [{ feature: "Sole", value: "Rubber" }],
  result : [{
    style_id: 70540,
    name: "Forest Green & Black",
    original_price: 140.00,
    sale_price: null,
    "default?": true,
    "photos": [
      {
          thumbnail_url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
          url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
      }
    ],
    skus: {
      sku_id: 37,
      quantity: 8,
      size: "XS"
    }
  }]
});

console.log(camo.product_id);

camo.save((err, camo) => {
  if (err) return console.error(err)
  console.log('camo', camo)
})

Shirt.find((err, shirts) => {
  if (err) return console.error(err)
  console.log('shirts', shirts)
})


console.log('productSchema', productSchema)

module.exports.productSchema = productSchema;
