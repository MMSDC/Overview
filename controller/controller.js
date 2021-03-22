const db = require('../database/database.js');

module.exports.getAllProducts = (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;

  db.getAllProducts(page, count)
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      res.status(500).json({
        error: error,
      })
    })
}

module.exports.getOneProduct = (req, res) => {
  db.getOneProduct(req.params.id)
    .then(response => {
      if (response) {
        // console.log('response', response)
        res.json(response)
      } else {
        res.status(404).send('Product Not Found');
      }
    })
    .catch(error => {
      res.status(500).json({
        error: error,
      })
    })
};

module.exports.getProductStyles = (req, res) => {
  db.getProductStyles(req.params.id)
    .then(response => {
      if (response) {
        console.log('response', response)
        res.json(response)
      } else {
        res.status(404).send('Styles Not Found');
      }
    })
    .catch(error => {
      res.status(500).json({
        error: error,
      })
    })
};