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

//Create collection of active customers (that did orders) add how many orders and total cookies
//if we want to update already active customers dont run next 2 lines
db.active_customers.drop()
db.createCollection("active_customers")

db.customers.find().forEach(customer => {
    let howManyCookies=0
    const howManyOrders=db.orders.find({customerId:customer._id}).count()
    if(howManyOrders>0){
        db.orders.find({customerId:customer._id}).forEach((order)=>order.details.forEach(orderDetail=>howManyCookies+=orderDetail.quantity))
        if(db.active_customers.find({customerId:customer._id}).count()>0)//should update collection with latest details if customer was already active
        {
            db.active_customers.updateOne({customerId:customer._id},{$set:{ordersNum:howManyOrders,totalCookies:howManyCookies}})
        }
        else{
            db.active_customers.insertOne({
                customerId:customer._id,
                customerName:customer.name,
                customerEmail:customer.email,
                ordersNum:howManyOrders,
                totalCookies:howManyCookies
            })
        }
        
    }
})
db.active_customers.find().pretty()


/////////////////////////////ORDERS/////////////////////////////

//Create Backup of old orders that are more than one month ago
db.orders_bck.drop()
db.createCollection("orders_bck")
const oneMonthAgo = new Date();
oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
db.orders.find({ orderDate: { $lte: oneMonthAgo } }).forEach( function(docs){db.orders_bck.insertOne(docs);} ) 
//Find how many old orders are there
db.orders_bck.find().count()
//Find how many orders are there
db.orders.find().count()
//Find the difference - how many orders in the last month
db.orders.find().count()-db.orders_bck.find().count()

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
