var express = require('express');
var router = express.Router();

/* GET reponse listing. */
router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM reponse`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET reponse listing with id. */
router.get('/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let sql = `SELECT * FROM reponse WHERE id_Reponse=?`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET reponse for video. */
router.get('/video/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let join = 'JOIN user ON reponse.id_User = user.id_User JOIN commentaire ON reponse.id_Commentaire = commentaire.id_Commentaire';
    let sql = `SELECT reponse.*, pseudo_User, avatar FROM reponse ${join} WHERE commentaire.id_Video=?`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

module.exports = router;
