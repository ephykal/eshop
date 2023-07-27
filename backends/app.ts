require("dotenv/config");
// import dot from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { Logging } from "./src/library/logging";
const port: string = process.env.PORT || 2500;
const url: string = process.env.MONGO_URL;
const api: string = process.env.API_ROUTE;
import categoryRoute from "./src/routes/category.routes";
import productRoute from "./src/routes/product.routes";
import userRoute from "./src/routes/user.routes";
import orderRoute from "./src/routes/order.routes";
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(
  "/public/uploads",
  express.static(__dirname + "/public/uploads")
);

app.use(`${api}/category`, categoryRoute);
app.use(`${api}/products`, productRoute);
app.use(`${api}/user`, userRoute);
app.use(`${api}/order`, orderRoute);

app.listen(port, () => {
  Logging.info(`App running on port:${port}`);
});

mongoose
  .connect(url, {
    dbName: "typescript-eshop-database",
  })
  .then(() => {
    Logging.info("Sucessfully connected to DB");
  })
  .catch((error: string) => {
    Logging.error("Error while connecting to DB, pls check your connection");
  });
