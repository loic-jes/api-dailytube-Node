var express = require('express');
var router = express.Router();

/* GET playlist listing. */
router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM playlist`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET playlist listing with id. */
router.get('/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let sql = `SELECT * FROM playlist WHERE id_Playlist=?`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

module.exports = router;
