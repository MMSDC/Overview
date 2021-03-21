const db = require('../database/index.js');

module.exports.getAllProducts = (req, res) => {
    db.queryAllProducts()
      .then(response => {
        res.json(response)
      })
      .catch(error => {
        res.status(500).json({
          error: error,
        })
      })
}

module.exports.getOneProduct = (req, res) {
  db.getOneProduct(req.params.id)
    .then(response => {
      if (response) {
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
});

module.exports.getProductStyles = (req, res) {
  db.getProductStyles(req.params.id)
    .then(response => {
      if (response) {
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
});