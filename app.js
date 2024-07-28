const connectDB = require("./config/db");
require("dotenv").config();
require("express-async-errors");
const path = require("path");

const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middleware/authentication");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());
app.use(helmet());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

app.get("*", (req, res) => {
  res
    .header({ contentType: "text/html" })
    .sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    app.listen(port, () => {
      console.log("Server is running on port:3000");
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
