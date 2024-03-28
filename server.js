const express = require("express");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
require("dotenv").config();

// Setup passport
const SessionMongoDB = require("./session");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./middlewares/PassportConfig");
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: false,
    },
    store: SessionMongoDB,
  })
);

// Setup Template
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(flash());

// Static files
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Setup parse
app.use(express.urlencoded({ extended: true }));

// Setup mongoose connection and handling connection errors
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message));

// Routes
const routes = require("./routes");
routes.forEach((routeConfig) => {
  app.use(routeConfig.path, routeConfig.route);
});

app.listen(3000, () => {
  console.log("Server is running on localhost:3000");
});
