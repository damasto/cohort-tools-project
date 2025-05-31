//IMPORTS
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./utils/swagger.yaml")


//Allowed origins for CORS
const origins = ["http://localhost:5173"];


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


//Enhance security
app.use(helmet());
app.disable("x-powered-by'"); //hides which language server is built on
app.set("trust-proxy", 1);
app.use(session({
  secret: "s3Cur3",
  name: "sessionId",
  saveUninitialized: true,
  resave: false,
}));


//routes
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/docs", docRouter);
//Swagger API documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);


//error handlers
app.use(errorHandler);
app.use(notFoundHandler)


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
