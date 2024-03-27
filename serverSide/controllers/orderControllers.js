import catchErrors from "../checkmate/catchErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../checkmate/errorHandler.js";
import Product from "../models/product.js";

export const newOrder = catchErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
});

// get order details

export const getOrderDetails = catchErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('No order found with this Id', 400));
  }

  res.status(200).json({
    order,
  });
});

// get current user order details

export const myOrders = catchErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    orders,
  });
});

// get all orders

export const allOrders = catchErrors(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    orders,
  });
});

// update order

export const updateOrder = catchErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('No order found with this Id', 400));
  }

  if (order?.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400));
  }

  // update products stock

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product.toString());

    if (!product) {
      return next(new ErrorHandler('No Product found with this Id', 404));
    }

    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});

// Delete order details

export const deleteOrder = catchErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order has been deleted', 400));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

// get sales Data

export const getSales = catchErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);

  const { salesData, totalSales, totalNumOrders } = await getSalesData(startDate, endDate);

  res.status(200).json({
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 },
      },
    },
  ]);

  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  const datesBetween = getDatesBetween(startDate, endDate);

  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
