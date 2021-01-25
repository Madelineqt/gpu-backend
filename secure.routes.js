const express = require('express');
const router = express.Router();
var path = require('path');

router.get('/',(req, res, next) => {
    res.sendFile(path.join(__dirname + '/public/panel.html'));
  }
);


module.exports = router;