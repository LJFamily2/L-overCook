if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

// Setup Session
const session = require("express-session");
const SessionMongoDB = require("./session");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: SessionMongoDB,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Setup passport
const passport = require("passport");
const initializePassport = require("./middlewares/passportConfig");
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Setup Template
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(flash());

// Static files
app.set("views", __dirname + "/views");
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

app.listen(5000, () => {
  console.log("Server is running on localhost:3000");
});
