const express = require("express");
const { homeRender, indexRender, aboutRender } = require("../controller/homeController");
const router = express.Router();

//Routing for the home page
router.route('/').get(homeRender);
router.route('/index').get(indexRender);
router.route('/about').get(aboutRender);
module.exports = router;