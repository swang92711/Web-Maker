const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

app.use(cookieParser());

if (process.env.SESSION_SECRET) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true
    })
  );
} else {
  app.use(
    session({
      secret: "local-cookie",
      resave: true,
      saveUninitialized: true
    })
  );
}

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "dist")));

// CORS - Cross Origin Resource Sharing
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const port = process.env.PORT || "3100";
app.set("port", port);

const server = http.createServer(app);

require("./server/app")(app);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

// server.listen(port);
server.listen(port, function() {
  console.log("Running on " + app.get("port"));
});
