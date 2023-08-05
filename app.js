const express = require("express");
const bookpath = require("./routes/books");
const authorpath = require("./routes/authors");
const authpath = require("./routes/auth");
const usersPath = require("./routes/users");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const { notFoundError, errorHandler } = require("./middleware/error");
dotenv.config();

//connect database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

express();
//init app
const app = express();

//apply middleware
app.use(express.json());

// router
app.use(logger);
app.use("/api/books", bookpath);
app.use("/api/authors", authorpath);
app.use("/api/auth", authpath);
app.use("/api/users", usersPath);

app.use(notFoundError);
app.use(errorHandler);

//running server
const port = 5000;
app.listen(port, console.log(`server.running on ${port}`));
