
////////////////////////////////////////////Establishing The DB///////////////////////////////////////////////////////
use cookieStore

// Create the "cookies" collection
db.createCollection("cookies")
// Create the "customers" collection
db.createCollection("customers")
// Create the "orders" collection
db.createCollection("orders")

/////////////////////////////COOKIES/////////////////////////////
// Helper function to generate a random price
function generatePrice() {
  return (Math.random() * (5 - 1.5) + 1.5).toFixed(2);
}

// Helper function to select a random category
function selectCategory() {
  const categories = ["Classic", "Seasonal", "Premium", "Vegan", "Gluten-Free"];
  return categories[Math.floor(Math.random() * categories.length)];
}

// Helper function to generate random nutritional information
function generateNutritionalInfo() {
  return {
    calories: Math.floor(Math.random() * (500 - 100) + 100),
    fat: Math.floor(Math.random() * (20 - 5) + 5),
    sugar: Math.floor(Math.random() * (30 - 10) + 10)
  };
}

// Helper function to generate a list of ingredients
function generateIngredients(type) {
  const baseIngredients = ["flour", "sugar", "baking soda", "salt"];
  const typeSpecificIngredients = {
    "Chocolate Chip": ["chocolate chips"],
    "Peanut Butter": ["peanut butter"],
    "Oatmeal Raisin": ["oats", "raisins"],
    // Add specific ingredients for other types as needed
  };
  return baseIngredients.concat(typeSpecificIngredients[type] || []);
}

// Arrays of cookie types and tastes
const cookieTypes = [
  "Chocolate Chip", "Peanut Butter", "Oatmeal Raisin", "Sugar", "Snickerdoodle",
  "Ginger Snap", "Pumpkin Spice", "Macadamia Nut", "White Chocolate Raspberry",
  "Lemon Drop", "Mint Chocolate", "Triple Chocolate", "Salted Caramel",
  "Coconut Delight", "Almond Joy", "Mocha Chip", "Cinnamon Roll",
  "Blueberry Cheesecake", "Matcha", "Vegan Chocolate Chip"
];
const tastes = [
  "with Extra Chocolate", "with Sea Salt", "and Caramel Swirl", "with Vanilla Bean",
  "with Cinnamon Sugar", "with Maple Glaze", "with Pumpkin Seeds", "with Toasted Coconut",
  "with Raspberry Filling", "with Lemon Zest", "with Peppermint Bits", "with Dark Chocolate Chunks",
  "with Salted Caramel Drizzle", "with Coconut Flakes", "with Almond Slices", "with Espresso",
  "with Cream Cheese Frosting", "with Cheesecake Pieces", "with Matcha Powder", "Gluten-Free"
];

// Inserting 400 unique cookies by combining each type with each taste
cookieTypes.forEach(type => {
  tastes.forEach(taste => {
    const cookieName = `${type} ${taste}`; // Combining type and taste for a unique name
    const includeIngredients = Math.random() > 0.5; // 50% chance to include ingredients

    const cookieDocument = {
      name: cookieName,
      price: parseFloat(generatePrice()),
      category: selectCategory(),
      nutritionalInfo: generateNutritionalInfo(),
    };

    // Conditionally add ingredients
    if (includeIngredients) {
      cookieDocument.ingredients = generateIngredients(type);
    }

    db.cookies.insertOne(cookieDocument);
  });
});

/////////////////////////////CUSTOMERS/////////////////////////////
// Helper functions for generating customer data
function generateCustomerName() {
  const names = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Skyler", "Jamie", "Robin", "Dakota", "Cameron"];
  return names[Math.floor(Math.random() * names.length)];
}

function generateEmail(name) {
  const domains = ["@example.com", "@mail.com", "@web.com"];
  return name.toLowerCase() + Math.floor(Math.random() * 100) + domains[Math.floor(Math.random() * domains.length)];
}

function generateAddresses() {
  const streets = ["Main St", "Second St", "Third St", "Fourth St", "Fifth St"];
  const cities = ["Anytown", "Springfield", "Greenville", "Fairview", "Midtown"];
  const states = ["CA", "NY", "TX", "FL", "NV"];

  const numberOfAddresses = Math.floor(Math.random() * 3) + 1; // 1 to 3 addresses
  const addresses = [];

  for (let i = 0; i < numberOfAddresses; i++) {
    addresses.push({
      street: Math.floor(Math.random() * 1000) + " " + streets[Math.floor(Math.random() * streets.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)]
    });
  }

  return addresses;
}

function generatePreferences() {
  const preferences = ["Classic", "Vegan", "Gluten-Free", "Seasonal", "Premium"];
  return preferences.filter(() => Math.random() > 0.5);
}

// Insert 100 customers with mixed data modeling
for (let i = 0; i < 100; i++) {
  const name = generateCustomerName();
  db.customers.insertOne({
    name: name,
    email: generateEmail(name),
    addresses: generateAddresses(),
    preferences: generatePreferences()
  });
}

/////////////////////////////ORDERS/////////////////////////////
// Helper function to randomly select cookies and customers
async function getRandomCookieIds() {
  const cookies = await db.cookies.aggregate([{ $sample: { size: 5 } }]).toArray(); // Get 5 random cookies
  return cookies.map(cookie => cookie._id);
}

async function getRandomCustomerId() {
  const customer = await db.customers.aggregate([{ $sample: { size: 1 } }]).toArray(); // Get 1 random customer
  return customer[0]._id;
}

function generateOrderDetails(cookieIds) {
  return cookieIds.map(cookieId => ({
    cookieId: cookieId,
    quantity: Math.floor(Math.random() * 5) + 1 // 1 to 5 cookies of each type
  }));
}

function generateSpecialInstructions() {
  const instructions = ["Please deliver after 6pm", "", "Leave at the front desk", "Pack cookies separately", ""];
  return instructions[Math.floor(Math.random() * instructions.length)];
}

// Helper function to generate a random date within a range
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Insert orders with mixed data modeling
(async () => {
  // Define the range for random dates (e.g., past year)
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); // One year ago
  const endDate = new Date(); // Current date

  for (let i = 0; i < 200; i++) {
    const cookieIds = await getRandomCookieIds();
    const customerId = await getRandomCustomerId();
    const orderDate = getRandomDate(startDate, endDate); // Get a random date within the defined range

    db.orders.insertOne({
      customerId: customerId,
      details: generateOrderDetails(cookieIds),
      specialInstructions: generateSpecialInstructions(),
      promoCode: Math.random() > 0.8 ? "DISCOUNT10" : "", // 20% chance to apply a promo code
      orderDate: orderDate // Add the random order date
    });
  }
})();
