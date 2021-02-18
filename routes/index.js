var express = require('express');
const { route } = require('./users');
var router = express.Router();

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Post Global
router.post('/', (req, res, next) => {
  const table = req.body.table !== undefined ? req.body.table : null;
  const params = req.body.params !== undefined ? req.body.params : null;

  if (table !== null && params !== null) {
    let sql = `INSERT INTO ?? SET ?`;
    db.query(sql, [table, params], (err, result, fields) => {
      if (err) throw err;
      res.json(result.insertId);
    })
  }
  else {
    res.json(false);
  }
});

// Put Global
router.put('/', (req, res, next) => {
  const table = req.body.table !== undefined ? req.body.table : null;
  const params = req.body.params !== undefined ? req.body.params : null;
  const id = req.body.id !== undefined ? req.body.id : null;

  if (table !== null && params !== null && id !== null) {
    let ucTable = capitalizeFirstLetter(table);
    let where = `id_${ucTable} = ?`;
    let sql = `UPDATE ?? SET ? WHERE ${where}`;
    db.query(sql, [table, params, id], (err, result, fields) => {
      if (err) throw err;
      res.json(result.changedRows);
    })
  }
  else {
    res.json(false);
  }
})

// Delete Global
router.delete('/', (req, res, next) => {
  const table = req.body.table !== undefined ? req.body.table : null;
  const id = req.body.id !== undefined ? req.body.id : null;
  const tableId = req.body.tableId !== undefined ? req.body.tableId : null;
  const joinId = req.body.joinId !== undefined ? req.body.joinId : null;
  const joinAs = req.body.joinAs !== undefined ? req.body.joinAs : null;

  if (table !== null && id !== null) {
    let ucTable = capitalizeFirstLetter(table);
    let where = `id_${ucTable} = ?`;
    let sql = `DELETE FROM ?? WHERE ${where}`;
    if (joinId !== null && joinAs !== null && tableId !== null) {
      let ucTableId = capitalizeFirstLetter(tableId);
      let ucJoin = capitalizeFirstLetter(joinAs);
      where = `id_${ucTableId} = ? AND id_${ucJoin} = ?`;
      sql = `DELETE FROM ?? WHERE ${where}`;
      db.query(sql, [table, id, joinId], (err, result, fields) => {
        if (err) throw err;
        res.json(result.affectedRows);
      })
    }
    else if (tableId === null && joinId === null && joinAs === null) {
      db.query(sql, [table, id], (err, result, fields) => {
        if (err) throw err;
        res.json(result.affectedRows);
      })
    }
    else {
      res.json(false);
    }
  }
  else {
    res.json(false);
  }
})

module.exports = router;
