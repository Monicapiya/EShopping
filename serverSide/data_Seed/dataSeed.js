import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const productDetails = async () => {
  try {
    await mongoose.connect(`mongodb+srv://piyalimonica:Ji3Z5zjz7rhXvOUo@it-takes-time.x3yyuao.mongodb.net/?retryWrites=true&w=majority&appName=EShopping
    `);

    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

productDetails();
