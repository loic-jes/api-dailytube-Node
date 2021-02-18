var express = require('express');
var router = express.Router();

/* GET categorie listing. */
router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM categorie`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET categorie listing with id. */
router.get('/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let sql = `SELECT * FROM categorie WHERE id_Categorie=?`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

module.exports = router;
