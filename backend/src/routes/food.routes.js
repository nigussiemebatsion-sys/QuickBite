const express = require("express");
const foodcontroller = require('../controllers/food.controller');

const router = express.Router();

router.get('/', foodcontroller.getAllFoods);
router.get("/:id",foodcontroller.getFoodById)

module.exports = router;
