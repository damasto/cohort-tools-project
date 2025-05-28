const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

//cors middleware
const cors = require("cors");
const origins = ["http://localhost:5173"]

const mongoose = require("mongoose")

//Router
const apiRouter = require("./routes/api.routes");
const authRouter = require("./routes/auth.routes");
const docRouter = require("./routes/doc.routes");

//custom error handlers
const {errorHandler, notFoundHandler} = require("./middleware/errorHandling")


// INITIALIZE EXPRESS APP
const app = express();
const PORT = 5005;

//CONNECT TO MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to mongo", err));

//MIDDLEWARE

//allow frontend to connect to server
app.use(cors({
  origin: origins
}))
//Process incoming request data
app.use(express.json());
//logs details about incoming http in terminal
app.use(logger("dev"));
//Serve static files
app.use(express.static("public"));
//Parses URL-encoded form data (e.g., from HTML forms) into req.body
app.use(express.urlencoded({ extended: false }));
//Parses cookies attached to client requests into req.cookies
app.use(cookieParser());

//routes
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/docs", docRouter);

//error handlers
app.use(errorHandler);
app.use(notFoundHandler)

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
