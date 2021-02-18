var express = require('express');
var router = express.Router();

/* GET video listing. */
router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM video`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

/* GET video listing with id. */
router.get('/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    let join = 'JOIN chaine ON video.id_Chaine = chaine.id_Chaine JOIN user ON chaine.id_Chaine = user.id_Chaine JOIN categorie ON video.id_Categorie = categorie.id_Categorie';
    let sql = `SELECT video.*, nb_abonne, pseudo_User, avatar, nom_Categorie FROM video ${join} WHERE id_Video=?`;
    let video = {};
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        video = data[0];
        join = 'JOIN chaine ON video.id_Chaine = chaine.id_Chaine JOIN user ON chaine.id_Chaine = user.id_Chaine';
        sql = `SELECT video.*, pseudo_User FROM video ${join} WHERE id_Categorie = ? AND video.id_Video != ? AND video.active_Video = 1`;
        db.query(sql, [video.id_Categorie, id], (err, result, fields) => {
            if (err) throw err;
            let obj = { video, all: result };
            res.json(obj);
        })
    })
});

// GET Vidéo Accueil
router.get('/accueil/recent', (req, res, next) => {
    let join = 'JOIN chaine ON video.id_Chaine = chaine.id_Chaine JOIN user ON chaine.id_Chaine = user.id_Chaine';
    let sql = `SELECT video.*, pseudo_User FROM video ${join} ORDER BY video.date_Video DESC LIMIT 24 `;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
})

// GET Vidéo Accueil
router.get('/accueil/search/:search', (req, res, next) => {
    const search = req.params.search !== null ? req.params.search : null;
    if (search !== null) {
        let join = 'JOIN chaine ON video.id_Chaine = chaine.id_Chaine JOIN user ON chaine.id_Chaine = user.id_Chaine';
        let sql = `SELECT video.*, pseudo_User FROM video ${join} WHERE titre_Video LIKE ? OR description_Video LIKE ? ORDER BY video.date_Video DESC LIMIT 24`;
        db.query(sql, [`%${search}%`, `%${search}%`], (err, data, fields) => {
            if (err) throw err;
            res.json(data);
        })
    }
    else {
        res.json(false);
    }
})

// GET Abonnement
router.get('/:id/abonnement', function (req, res, next) {
    const id = parseInt(req.params.id);
    let join = 'JOIN chaine ON video.id_Chaine = chaine.id_Chaine JOIN user ON chaine.id_Chaine = user.id_Chaine JOIN abonner ON chaine.id_Chaine = abonner.id_Chaine ';
    let sql = `SELECT video.*, pseudo_User FROM video ${join} WHERE abonner.id_User = ? ORDER BY video.date_Video DESC`;
    db.query(sql, [id], (err, data, fields) => {
        if (err) throw err;
        res.json(data);
    })
});

// PUT Jaime Video
router.put('/voter', function (req, res, next) {
    const idUser = req.body.idUser !== undefined ? req.body.idUser : null;
    const idVideo = req.body.idVideo !== undefined ? req.body.idVideo : null;
    const params = req.body.params !== undefined ? req.body.params : null;
    let nameKey = '';

    if (idUser !== null && idVideo !== null && params !== null) {
        let sql = 'SELECT * FROM voter WHERE id_User = ? AND id_Video = ?';
        db.query(sql, [idUser, idVideo], (err, data, fields) => {
            if (err) throw err;
            if (data.length === 0) {
                let set = '';
                let values = [];
                Object.keys(params).map((key) => {
                    nameKey = key;
                    set += `${key} = ?,`;
                    values.push(params[key]);
                })
                set = set.slice(0, -1);
                sql = `UPDATE video SET ${set} WHERE id_Video = ?`;
                values.push(idVideo);

                db.query(sql, values, (err, result, fields) => {
                    if (err) throw err;
                    if (result.changedRows === 1) {
                        let jaime = 0;
                        if (nameKey == 'jaime_Video') {
                            jaime = 1;
                        }
                        sql = 'INSERT INTO voter SET id_Video = ?, id_User = ?, jaime = ?';
                        db.query(sql, [idVideo, idUser, jaime], (err, result, fields) => {
                            if (err) throw err;
                            res.json(true);
                        })
                    }
                    else {
                        res.json(false);
                    }
                })
            }
            else {
                res.json(false);
            }
        })
    }
    else {
        res.json(false);
    }
});

module.exports = router;
