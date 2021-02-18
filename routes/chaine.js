var express = require('express');
var router = express.Router();

/* GET chaine listing. */
router.get('/', function(req, res, next) {
  let sql = `SELECT * FROM chaine`;
  db.query(sql, (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

/* GET chaine listing with id. */
router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id);
  let sql = `SELECT * FROM chaine WHERE id_Chaine=?`;
  db.query(sql, [id], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

router.get('/:idchaine/videos', function (req, res, next) { // Sort toutes les vidéos publiées par un utilisateur
  const id_Chaine = parseInt(req.params.idchaine);
  let sql = `SELECT * FROM video JOIN chaine ON video.id_Chaine=chaine.id_Chaine AND chaine.id_Chaine = ?`;
  db.query(sql, [id_Chaine], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

router.get('/:idchaine/videos/last4activevideos', function (req, res, next) { // Sort les dernières vidéos encore actives publiées par un utilisateur (et en gardera que 4 en javascript)
  const id_Chaine = parseInt(req.params.idchaine);
  let sql = `SELECT * FROM video JOIN chaine ON video.id_Chaine=chaine.id_Chaine AND chaine.id_Chaine =? AND video.active_Video = true ORDER BY date_Video DESC`;
  db.query(sql, [id_Chaine], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

module.exports = router;
