var express = require('express');
var router = express.Router();

/* GET commentaire listing. */
router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM commentaire`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET commentaire listing with id. */
router.get('/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let sql = `SELECT * FROM commentaire WHERE id_Commentaire=?`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET commentaire listing with id_Video. */
router.get('/video/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let sql = `SELECT commentaire.*, pseudo_User, avatar FROM commentaire JOIN user ON commentaire.id_User = user.id_User WHERE commentaire.id_Video=? ORDER BY commentaire.date_Commentaire DESC`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

module.exports = router;
