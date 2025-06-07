//IMPORTS
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const sanitize = require("mongo-sanitize");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
const csrf = require("csurf");
const session = require("express-session");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./utils/swagger.yaml");


//Allowed origins for CORS
const origins = ["http://localhost:5173"];


//Router
const apiRouter = require("./routes/api.routes");
const authRouter = require("./routes/auth.routes");
const docRouter = require("./routes/doc.routes");


//custom error handlers
const { errorHandler, notFoundHandler } = require("./middleware/errorHandling")


// INITIALIZE EXPRESS APP
const app = express();
const PORT = 5005;


//CONNECT TO MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongo", err));
}


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
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  req.query = sanitize(req.query);
  next();
});
app.use(limiter); //prevent brute force attacks
//app.use(csrf({cookie: true})); //protect against Cross-Site Request Forgery


//routes
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/docs", docRouter);
//Swagger API documentation


app.get("/ping", (req, res) => {
  res.send("pong")
})


//error handlers
app.use(errorHandler);
app.use(notFoundHandler)


// START SERVER
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}


module.exports = app
