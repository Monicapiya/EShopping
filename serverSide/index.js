// Error handle
process.on("uncaughtException", (err) => {
  console.error(`ERROR: ${err}`);
  console.error("Closing down due to unexpected error");
  process.exit(1);
});

//handling promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`ERROR: ${err}`);
  console.error("Closing the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import middlewareErrors from "./middlewares/errors.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/autho.js";
import { connectDatabase } from "./config/dbConnect.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/order.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "serverSide/config/config.env" });
}

// Connecting to db
try {
  connectDatabase();
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // Exit the process if unable to connect to MongoDB
}

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
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
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );

  console.log(process.env.DB_URI);
});

