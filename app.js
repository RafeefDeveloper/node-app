const express = require("express");
const bookpath = require("./routes/books");
const authorpath = require("./routes/authors");
const mongoose = require("mongoose");

//connect database
mongoose
  .connect("mongodb://127.0.0.1:27017/storeDB")
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

express();
//init app
const app = express();

//apply middleware
app.use(express.json());

// router
app.use("/api/books", bookpath);
app.use("/api/authors", authorpath);

//running server
const port = 5000;
app.listen(port, console.log(`server.running on ${port}`));
