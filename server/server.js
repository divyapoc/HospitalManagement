import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import v1 from "./v1/index.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: "https://hospitalmanagementserver.onrender.com", // frontend URI (ReactJS)
};
app.use(cors(corsOptions));
app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = [
    "http://localhost:3000",
    "https://hospitalmanagementserver.onrender.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

// app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/v1", v1);
app.use("/v1/uploads", express.static("./v1/uploads"));

let port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
