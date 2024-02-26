// Aggregate Total Sales by Cookie Category
//This aggregation calculates the total sales revenue per cookie category
//by joining the cookies and orders collections,
//grouping the results by cookie category, and summing up the total sales.
db.cookies.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "details.cookieId",
      as: "orderDetails",
    },
  },
  { $unwind: "$orderDetails" },
  { $unwind: "$orderDetails.details" },
  { $match: { "orderDetails.details.cookieId": { $exists: true } } },
  {
    $group: {
      _id: "$category",
      totalSales: {
        $sum: { $multiply: ["$price", "$orderDetails.details.quantity"] },
      },
    },
  },
  { $sort: { totalSales: -1 } },
]);

//Find Most Popular Cookies Based on Orders
//This query identifies the most popular cookies based on the quantity ordered,
//using the orders collection to group by cookie ID and count the total quantity ordered for each.
db.orders.aggregate([
  { $unwind: "$details" },
  {
    $group: {
      _id: "$details.cookieId",
      totalQuantity: { $sum: "$details.quantity" },
    },
  },
  { $sort: { totalQuantity: -1 } },
  { $limit: 5 },
  {
    $lookup: {
      from: "cookies",
      localField: "_id",
      foreignField: "_id",
      as: "cookieDetails",
    },
  },
  { $unwind: "$cookieDetails" },
  { $project: { cookieName: "$cookieDetails.name", totalQuantity: 1 } },
]);

//Customer Preferences Analysis
//Analyzes customer preferences to see which cookie categories are most preferred.
//It groups customers by their preferences and counts how many customers prefer each category.
db.customers.aggregate([
  { $unwind: "$preferences" },
  {
    $group: {
      _id: "$preferences",
      numCustomers: { $sum: 1 },
    },
  },
  { $sort: { numCustomers: -1 } },
]);

//Aggregate Total Nutritional Information per Order
//Calculates the total nutritional information (calories, fat, sugar) for each order
//by joining the cookies and orders collections and summing up the nutritional values based on the quantities ordered.
db.orders.aggregate([
  { $unwind: "$details" },
  {
    $lookup: {
      from: "cookies",
      localField: "details.cookieId",
      foreignField: "_id",
      as: "cookieInfo",
    },
  },
  { $unwind: "$cookieInfo" },
  {
    $group: {
      _id: "$_id",
      totalCalories: {
        $sum: {
          $multiply: [
            "$cookieInfo.nutritionalInfo.calories",
            "$details.quantity",
          ],
        },
      },
      totalFat: {
        $sum: {
          $multiply: ["$cookieInfo.nutritionalInfo.fat", "$details.quantity"],
        },
      },
      totalSugar: {
        $sum: {
          $multiply: ["$cookieInfo.nutritionalInfo.sugar", "$details.quantity"],
        },
      },
    },
  },
]);

//Active Customers with Most Orders
//Identifies customers who have placed the most orders,
//potentially filtering only those who have been active within a certain timeframe.
db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",
      totalOrders: { $sum: 1 },
    },
  },
  { $sort: { totalOrders: -1 } },
  { $limit: 5 },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customerDetails",
    },
  },
  { $unwind: "$customerDetails" },
  { $project: { customerName: "$customerDetails.name", totalOrders: 1 } },
]);
