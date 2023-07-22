const port = 5000;

const express = require("express");
const bookpath = require("./routes/books");

express();
//init app
const app = express();

//apply middleware
app.use(express.json());

// router
app.use("/api/books", bookpath);

app.listen(port, console.log(`server.running on ${port}`));
