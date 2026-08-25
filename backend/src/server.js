const app = require('./app');
const PORT = process.env.PORT || 3000;
//Server.js is responsible for starting the server and listening for incoming requests. It imports the app from app.js and starts the server on the specified PORT.
app.listen(PORT,() =>{
  console.log(`Server is running on PORT ${PORT}`);
})