import express from 'express';
import dotenv from "dotenv";
import middlewareErrors from "./middlewares/errors.js";
// import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/autho.js";
import { connectDatabase } from './config/dbConnect.js';
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/order.js";
import cors  from "cors";



const app = express();
app.use(cors());

import path from "path";
import { fileURLToPath } from 'url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Error handle
process.on("uncaughtException", (err) => {
  console.log( `ERROR: ${err}`);
  console.log("Closing down due to unexpected error");
  process.exit(1);
}
); 

dotenv.config({path: "serverSide/config/config.env"});

//connecting to db

connectDatabase();


app.use(express.json( {
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }

} ));
app.use(cookieParser());



app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use(middlewareErrors);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(_dirname, "../frontend/my-app/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "../frontend/my-app/build/index.html"));
  });
}


const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
}
);
  
// handling promise rejctions

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Closing the server due to unhandled promise rejection");
  server.close(() => {
   process.exit(1);
  });
}
);