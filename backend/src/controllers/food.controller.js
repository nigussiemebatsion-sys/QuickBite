const foodService = require("../services/food.service");

function getAllFoods(req,res){
  const foods = foodService.getAllFoods();
  return res.status(200).json({
    status: "Success",
    data:foods

  });
};

function getFoodById(req, res) {
    const id = Number(req.params.id);
    const food = foodService.getFoodById(id);

    if(!food){
      return res.status(404).json({
        message:"Resource not found"
      });
    }

    return res.status(200).json({
      status:"Success",
      data:food
    });
}

module.exports = {
    getAllFoods,
    getFoodById
};