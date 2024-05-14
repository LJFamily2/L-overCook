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
const initializePassport = require("./middlewares/PassportConfig");
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
app.use(express.json());

// Routes
const routes = require("./routes");
routes.forEach((routeConfig) => {
  app.use(routeConfig.path, routeConfig.route);
});

app.listen(3000 || PORT, () => {
  console.log("Server is running on localhost:3000");
});
