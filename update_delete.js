/////////////////////////////COOKIES/////////////////////////////
// Update One: Remove the last ingredient from cookies with the "Classic" category
db.cookies.updateMany(
    { category: "Classic" },
    { $pop: { ingredients: 1 } }
);

// Remove: Delete a specific cookie
db.cookies.remove(
    { name: "Peanut Butter with Sea Salt" }
);


// Rename: Rename the "cookies" collection to "biscuits"
db.cookies.renameCollection("biscuits");
// Rename: Rename the "biscuits" collection to "cookies"
db.biscuits.renameCollection("cookies");

/////////////////////////////CUSTOMERS/////////////////////////////

// Remove: Delete a specific customer
db.customers.remove(
    { name: "Taylor" }
);

// Remove: Delete all customers with no email addresses
db.customers.remove(
    { email: "" }
);

// Drop: Drop the "customers" collection
// db.clients.drop();

/////////////////////////////ORDERS/////////////////////////////

// Update One: Remove the "DISCOUNT10" promo code from orders with a specific customer ID
db.orders.updateOne(
    { customerId: ObjectId("65d6284103b7b7982a1e7a1e") },
    { $unset: { promoCode: "" } }
);

// Remove: Delete a specific order
db.orders.remove(
    { _id: ObjectId("65d6284803b7b7982a1e7acc") }
);

// Remove: Delete all orders with no details
db.orders.remove(
    { details: { $exists: false } }
);

// Rename: Rename the "orders" collection to "transactions"
// db.orders.renameCollection("transactions");

// Drop: Drop the "orders" collection
// db.transactions.drop();
