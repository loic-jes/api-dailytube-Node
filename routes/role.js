var express = require('express');
var router = express.Router();

/* GET role listing. */
router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM role`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET role listing with id. */
router.get('/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let sql = `SELECT * FROM role WHERE id_Role=`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

module.exports = router;
