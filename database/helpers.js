//i: style obj

const parseStyle = (style) => {
  // change original_price, default style/ default?, photos, skus
  style.original_price = style.original_price.toString()
  if((style.default_style) === 1 && (style["default?"] === undefined)) {
    style["default?"] = true;
  } else {
    style["default?"] = false;
  }
  style.photos = JSON.parse(style.photos);
  style.skus = JSON.parse(style.skus);
  return style
}

//input: array of style objects
//output: array of fixed style objects
module.exports.parseStyles = (styles) => {
  // change default style, photos, skus
  // loop over array of styles
  // call parseStyle(obj) on each style
  return styles.map(style => parseStyle(style))
}


module.exports.parseProduct = (product) => {
  // change product_id/id, features
  if((product.product_id) && (product.id === undefined)) {
    product.id = product.product_id;
  }
  product.features = JSON.parse(product.features);
  return product;
}

//input: array of one product object
//output: array of one product objects
// module.exports.parseProduct = (product) => {
//   return product.map(prod => parseFeature(prod))
// }