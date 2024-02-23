/////////////////////////////COOKIES/////////////////////////////
// Find cookies with prices greater than $4.97
// Sort the results by price in descending order
// Limit the results to 10 documents
// Print the name and price of each cookie
db.cookies.find({ price: { $gt: 4.97 } }).sort({ price: -1 }).limit(10).forEach(cookie => {
    print(`Name: ${cookie.name}, Price: ${cookie.price}`);
});

// Find cookies with the Seasonal or Vegan category
// Limit the results to 5 documents
// Print the name and category of each cookie
db.cookies.find({ category: { $in: ['Seasonal', 'Vegan'] } }).limit(5).forEach(cookie => { // Iterate over each document
    print(`Name: ${cookie.name}, Category: ${cookie.category}`); // Print name and type of each cookie
});

// Find cookies with calories between 200 and 300
// Sort the results by calories in ascending order
// Print the name and nutritional info of each cookie
const cookiesInRange = db.cookies.find({ "nutritionalInfo.calories": { $gte: 200, $lte: 300 } }).sort({ "nutritionalInfo.calories": 1 }).toArray();
print(`Number of cookies with calories between 200 and 300: ${cookiesInRange.length}`);
cookiesInRange.forEach(cookie => { // Iterate over each document
    print(`Name: ${cookie.name}, Calories: ${cookie.nutritionalInfo.calories}`); // Print name and nutritional info of each cookie
});

// Find cookies with names containing the letter "r" or "o" and prices greater than $3, and are Vegan
// Sort the results by price in descending order
// Limit the results to 10 documents
db.cookies.find({
    $or: [{ name: /r/ }, { name: /o/ }],
    price: { $gt: 3 },
    category: "Vegan"
}).sort({ price: -1 }).limit(10);

/////////////////////////////////////////Customers/////////////////////////
// Find customers who prefer either Classic or Vegan cookies and live in California or New York
db.customers.find({
    $or: [
        { preferences: "Classic" },
        { preferences: "Vegan" }
    ],
    $or: [
        { "addresses.state": "CA" },
        { "addresses.state": "NY" }
    ]
});

// Find customers who prefer Classic cookies and have addresses in both California and New York,
// but do not live in a city called "Anytown"
db.customers.find({
    preferences: "Classic",
    "addresses.state": { $all: ["CA", "NY"] },
    "addresses.city": { $nin: ["Anytown"] }
});

// Find customers emails whose name starts with "C" and live in the state of "NV"
db.customers.find({
    name: /^C/i, // Use a regular expression to match names starting with "C" (case-insensitive)
    "addresses.state": "NV" // Match customers who live in the state of "NV"
}, { email: 1, _id: 0 });

/////////////////////////////////////////Orders/////////////////////////

//Find how many orders so far
db.orders.find().count()

//Find all orders except for the first one ever made
db.orders.find().sort({orderDate:1}).skip(1)

//Find orders with a quantity greater than 3 and special instructions that are not empty:
db.orders.find({
    "details.quantity": { $gt: 3 }, // Find orders with a quantity greater than 3
    specialInstructions: { $ne: "" } // Find orders with non-empty special instructions
});

//Find orders with a promo code applied and sort them by customer ID in ascending order
db.orders.find({
    promoCode: { $exists: true, $ne: "" } // Find orders with a promo code applied
}).sort({ customerId: 1 });

//find all orders placed in the last week
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
db.orders.find({ orderDate: { $gte: oneWeekAgo } });

// Find orders with a promo code applied and a total price greater than $50
db.orders.find({ promoCode: { $exists: true, $ne: "" } }).forEach(order => {
    let totalPrice = 0;
    order.details.forEach(detail => {
        const cookie = db.cookies.findOne({ _id: detail.cookieId }); // Fetch the cookie details by its ID
        totalPrice += detail.quantity * cookie.price; // Calculate the total price for each order
    });
    if (totalPrice > 50) { // Check if the total price exceeds $50
        printjson(order); // Print the order details
    }
});