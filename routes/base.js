var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Helpers = require('../helpers/Helpers');

function getAuthorization(table, authoTables) {
    if (authoTables.includes(table) || authoTables[0] === '*') {
        return true;
    }
    else {
        return false;
    }
}

// Verify Token for GET
router.get('/', function (req, res, next) {
    let table = req.headers.allow !== undefined ? req.headers.allow : null;
    if (table !== null) {
        let token = req.headers.authorization !== undefined ? req.headers.authorization : null;
        let authoTables = [];
        let authorization = false;
        if (token === null) {
            authoTables = ['chaine', 'video', 'categorie', 'playlist', 'lister', 'reponse', 'commentaire'];
        }
        else {
            let decoded = jwt.verify(token, Helpers.secret);
            authoTables = ['*'];
        }
        authorization = getAuthorization(table, authoTables);
        if (authorization) {
            next();
        }
        else {
            res.json(false);
        }
    }
    else {
        // next();
        res.json(false);
    }
});

// Verify Token for POST
router.post('/', function (req, res, next) {
    let table = req.body.table !== undefined ? req.body.table : null;
    let login = req.body.login !== undefined ? req.body.login : false;
    if (table !== null || login) {
        if (login) {
            table = 'user';
        }
        let token = req.headers.authorization !== undefined ? req.headers.authorization : null;
        let authoTables = [];
        let authorization = false;
        if (token === null) {
            authoTables = ['user'];
        }
        else {
            let decoded = jwt.verify(token, Helpers.secret);
            if (decoded.role === 1) {
                authoTables = ['abonner', 'voter', 'reponse', 'commentaire', 'video', 'copier', 'playlist', 'lister', 'user'];
            }
            else if (decoded.role === 2) {
                authoTables = ['*'];
            }
        }
        authorization = getAuthorization(table, authoTables);
        if (authorization) {
            next();
        }
        else {
            res.json(false);
        }
    }
    else {
        res.json(false);
    }
});

// Verify Token for PUT
router.put('/', function (req, res, next) {
    let table = req.body.table !== undefined ? req.body.table : null;
    if (table !== null) {
        let token = req.headers.authorization !== undefined ? req.headers.authorization : null;
        let authoTables = [];
        let authorization = false;
        if (token === null) {
            authoTables = [''];
        }
        else {
            let decoded = jwt.verify(token, Helpers.secret);
            if (decoded.role === 1) {
                authoTables = ['video', 'playlist', 'lister', 'user', 'chaine'];
            }
            else if (decoded.role === 2) {
                authoTables = ['*'];
            }
        }
        authorization = getAuthorization(table, authoTables);
        if (authorization) {
            next();
        }
        else {
            res.json(false);
        }
    }
    else {
        res.json(false);
    }
});

// Verify Token for DELETE
router.delete('/', function (req, res, next) {
    let table = req.body.table !== undefined ? req.body.table : null;
    if (table !== null) {
        let token = req.headers.authorization !== undefined ? req.headers.authorization : null;
        let authoTables = [];
        let authorization = false;
        if (token === null) {
            authoTables = [''];
        }
        else {
            let decoded = jwt.verify(token, Helpers.secret);
            if (decoded.role === 1) {
                authoTables = ['video', 'playlist', 'lister', 'user', 'chaine', 'copier', 'abonner'];
            }
            else if (decoded.role === 2) {
                authoTables = ['*'];
            }
        }
        authorization = getAuthorization(table, authoTables);
        if (authorization) {
            next();
        }
        else {
            res.json(false);
        }
    }
    else {
        res.json(false);
    }
});

module.exports = router;
