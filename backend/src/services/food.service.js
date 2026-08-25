const foods = [
  {
    id:1,
    name:"Margherita Pizza",
    description:"Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.",
    price: 12.99,
    available: true
  },
  {
    id:2,
    name:"Burger",
    description:"Juicy beef patty with lettuce, tomato, cheese, and special sauce.",
    price: 9.99,
    available: true
  },
  {
    id:3,
    name:"Beef Lasagna",
    description:"Layers of pasta, beef, ricotta cheese, and marinara sauce.",
    price: 14.99,
    available: false
  }
];

function getAllFoods(){
  return foods;
}

function getFoodById(id){
  return foods.find(food =>food.id ===id);
}

module.exports = {
  getAllFoods,
  getFoodById
};
