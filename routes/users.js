var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const Helpers = require('../helpers/Helpers');
const nodemailer = require('nodemailer');

/* GET users listing. */
router.get('/', function (req, res, next) {
  let sql = `SELECT * FROM user`;
  db.query(sql, (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

/* GET users listing with id. */
router.get('/:id', function (req, res, next) {
  const id = parseInt(req.params.id);
  let sql = `SELECT * FROM user WHERE id_User=?`;
  db.query(sql, [id], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

router.get('/:id/chaine', function (req, res, next) {
  const id = parseInt(req.params.id);
  let sql = `SELECT chaine.* FROM user, chaine WHERE user.id_User=? AND chaine.id_Chaine = user.id_Chaine`;
  db.query(sql, [id], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

// GET Abonner
router.get('/abonner/:idChaine/:idUser', function (req, res, next) {
  const idChaine = parseInt(req.params.idChaine);
  const idUser = parseInt(req.params.idUser);
  let sql = `SELECT * FROM abonner WHERE id_Chaine = ? AND id_User = ?`;
  db.query(sql, [idChaine, idUser], (err, data, fields) => {
      if (err) throw err;
      res.json(data);
  })
});

router.get('/:id/:verifyName', function (req, res, next) { // Modification des données du compte : Vérifie que le pseudo est libre ou bien utilisé uniquement par l'user
  const id = parseInt(req.params.id);
  const name = req.params.verifyName;  
  // const name = `SELECT pseudo_User from user WHERE id_User=${id}`;
  let sql = `SELECT * from user WHERE pseudo_User=? AND id_User !=?`;
  db.query(sql, [name, id], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

router.get('/:id/verify/:verifyLogin', function (req, res, next) { // Modification des données du compte : Vérifie que l'email est libre ou bien utilisé uniquement par l'user
  const id = parseInt(req.params.id);
  const login = req.params.verifyLogin;
  let sql = `SELECT * from user WHERE email=? AND id_User !=?`;
  db.query(sql, [login, id], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

router.get('/:id/videos/last4activeplaylists', function (req, res, next) { // Sort les dernières playlist crées par un utilisateur (et en gardera que 4 en javascript)
  const id = parseInt(req.params.id);
  let sql = `SELECT * FROM playlist JOIN user ON playlist.id_User=user.id_User AND user.id_User = ? AND playlist.active_Playlist = true ORDER BY date_creation DESC`;
  db.query(sql, [id], (err, data, fields) => {
    if (err) throw err;
    res.json(data);
  })
});

// Register
router.post('/register', (req, res, next) => {
  const table = req.body.table !== undefined ? req.body.table : null;
  let params = req.body.params !== undefined ? req.body.params : null;
  let errExist = false;
  let sql = 'SELECT pseudo_User, email FROM user';

  if (table !== null && params !== null) {
    db.query(sql, (err, data, fields) => {
      if (err) throw err;
      for (let dt of data) {
        if (dt.email === params.email) {
          errExist = 'email exist';
          break;
        }
        else if (dt.pseudo_User === params.pseudo_User) {
          errExist = 'pseudo exist';
          break;
        }
      }
      if (!errExist) {
        sql = `INSERT INTO chaine SET nb_abonne = 0, description_Chaine = '', active_Chaine = 1`;
        db.query(sql, (err, result, fields) => {
          if (err) throw err;
          params.id_Chaine = result.insertId;
          sql = `INSERT INTO user SET ?`;
          argon2.hash(params.password, {
            type: argon2.argon2id,
            memoryCost: 1024,
            timeCost: 4
          }).then(hash => {
            params.password = hash.replace(Helpers.prefix, '');
            let token = jwt.sign({ email: params.email }, Helpers.secret, { expiresIn: (7 * 86400) });
            params.token = token;
            db.query(sql, params, (err, result, fields) => {
              if (err) throw err;
              if (result.insertId !== 0) {
                let transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'test.alexandre.didillon@gmail.com',
                    pass: 'test-adresse-12081995'
                  }
                });
                let html = `<p>Veuillez cliquer sur ce bouton pour valider votre comptre</p>
                  <a href='http://localhost:8000/activation/${token}' target='_blank'>
                    <button>Valider</button>
                  </a>`;
                transporter.sendMail({
                  from: 'noreply@dailytube.fr',
                  to: params.email,
                  subject: 'Validation de votre compte',
                  html
                }).then(info => {
                  if (info.accepted.length === 1) {
                    res.json(true);
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
          })
        })
      }
      else {
        res.json(errExist);
      }
    })
  }
  else {
    res.json(false);
  }
})

// Activation de compte
router.post('/activation', (req, res, next) => {
  const token = req.body.token !== undefined ? req.body.token : null;

  if (token !== null) {
    let decoded = jwt.verify(token, Helpers.secret);
    let email = decoded.email;
    let sql = 'SELECT * FROM user WHERE email = ?';

    db.query(sql, [email], (err, data, fields) => {
      if (err) throw err;
      if (data.length === 1) {
        sql = `UPDATE user SET active_User = ? WHERE id_User = ?`;
        db.query(sql, [1, data[0].id_User], (err, result, fields) => {
          if (err) throw err;
          res.json(result.changedRows);
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

// Login
router.post('/login', (req, res, next) => {

  let token = req.headers.authorization !== undefined ? req.headers.authorization : null;
  let user = req.body.user !== undefined ? req.body.user : null;

  if (token === null || user === null) {
    const email = req.body.email !== undefined ? req.body.email : null;
    const password = req.body.password !== undefined ? req.body.password : null;

    if (email !== null && password !== null) {
      let sql = `SELECT * FROM user WHERE email = ?`;

      db.query(sql, [email], (err, data, fields) => {
        if (err) throw err;
        if (data.length === 1) {
          if (data[0].active_User === 1) {
            data = data[0];
            argon2.verify(Helpers.prefix + data.password, password).then(resp => {
              if (resp) {
                token = jwt.sign({ id: data.id_User, role: data.id_Role }, Helpers.secret, { expiresIn: (30 * 86400) });
                let obj = {
                  user: data,
                  token
                };
                res.json(obj);
              }
              else {
                res.json(false);
              }
            })
          }
          else {
            res.json('not active');
          }
        }
        else {
          res.json(false);
        }
      })
    }
    else {
      res.json(false);
    }
  }
  else {
    let decoded = jwt.verify(token, Helpers.secret);
    if (user == decoded.id) {
      let sql = `SELECT * FROM user WHERE id_User = ?`;
      db.query(sql, [user], (err, data, fields) => {
        if (err) throw err;
        if (data[0].active_User === 1) {
          res.json(data);
        }
        else {
          res.json(false);
        }
      })
    }
    else {
      res.json(false);
    }
  }
})

module.exports = router;
