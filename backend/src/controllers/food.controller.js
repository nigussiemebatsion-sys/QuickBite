const foodService = require("../services/food.service");

async function getAllFoods(req, res) {
  try {
    const foods = await foodService.getAllFoods();
    return res.status(200).json({
      status: "Success",
      data: foods
    });
  } catch (err) {
    console.error("getAllFoods error:", err);
    return res.status(500).json({
      status: "Error",
      message: "Failed to fetch foods"
    });
  }
}

async function getFoodById(req, res) {
  try {
    const id = Number(req.params.id);
    const food = await foodService.getFoodById(id);

    if (!food) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    return res.status(200).json({
      status: "Success",
      data: food
    });
  } catch (err) {
    console.error("getFoodById error:", err);
    return res.status(500).json({
      status: "Error",
      message: "Failed to fetch food"
    });
  }
}

module.exports = {
  getAllFoods,
  getFoodById
};
