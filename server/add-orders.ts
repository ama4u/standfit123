import { storage } from "./storage";

async function addOrders() {
  console.log("Adding more sample orders...");

  try {
    const testUser = await storage.getUserByEmail("test@example.com");
    if (!testUser) {
      console.error("Test user not found!");
      return;
    }

    const allProducts = await storage.getProducts();
    if (allProducts.length === 0) {
      console.error("No products found!");
      return;
    }

    const existingOrders = await storage.getOrdersByUser(testUser.id);
    console.log(`Current orders for test user: ${existingOrders.length}`);

    // Order 1 - Completed
    const order1Items = [
      { productId: allProducts[0].id, quantity: 10, priceAtPurchase: allProducts[0].price, subtotal: allProducts[0].price * 10 },
      { productId: allProducts[3].id, quantity: 5, priceAtPurchase: allProducts[3].price, subtotal: allProducts[3].price * 5 },
    ];
    const order1Total = order1Items.reduce((sum, item) => sum + item.subtotal, 0);
    
    await storage.createOrder({
      userId: testUser.id,
      totalAmount: order1Total,
      status: "completed",
      shippingAddress: testUser.contactAddress || "123 Test Street, Lagos",
      paymentMethod: "bank_transfer",
      paymentStatus: "paid",
    }, order1Items);
    console.log("✓ Order 1 created (Completed)");

    // Order 2 - Processing
    const order2Items = [
      { productId: allProducts[1].id, quantity: 8, priceAtPurchase: allProducts[1].price, subtotal: allProducts[1].price * 8 },
      { productId: allProducts[5].id, quantity: 3, priceAtPurchase: allProducts[5].price, subtotal: allProducts[5].price * 3 },
    ];
    const order2Total = order2Items.reduce((sum, item) => sum + item.subtotal, 0);
    
    await storage.createOrder({
      userId: testUser.id,
      totalAmount: order2Total,
      status: "processing",
      shippingAddress: testUser.contactAddress || "123 Test Street, Lagos",
      paymentMethod: "cash_on_delivery",
      paymentStatus: "pending",
    }, order2Items);
    console.log("✓ Order 2 created (Processing)");

    // Order 3 - Pending
    const order3Items = [
      { productId: allProducts[2].id, quantity: 15, priceAtPurchase: allProducts[2].price, subtotal: allProducts[2].price * 15 },
    ];
    const order3Total = order3Items.reduce((sum, item) => sum + item.subtotal, 0);
    
    await storage.createOrder({
      userId: testUser.id,
      totalAmount: order3Total,
      status: "pending",
      shippingAddress: testUser.contactAddress || "123 Test Street, Lagos",
      paymentMethod: "bank_transfer",
      paymentStatus: "pending",
    }, order3Items);
    console.log("✓ Order 3 created (Pending)");

    // Order 4 - Cancelled
    const order4Items = [
      { productId: allProducts[4].id, quantity: 6, priceAtPurchase: allProducts[4].price, subtotal: allProducts[4].price * 6 },
    ];
    const order4Total = order4Items.reduce((sum, item) => sum + item.subtotal, 0);
    
    await storage.createOrder({
      userId: testUser.id,
      totalAmount: order4Total,
      status: "cancelled",
      shippingAddress: testUser.contactAddress || "123 Test Street, Lagos",
      paymentMethod: "bank_transfer",
      paymentStatus: "cancelled",
    }, order4Items);
    console.log("✓ Order 4 created (Cancelled)");

    const finalOrders = await storage.getOrdersByUser(testUser.id);
    console.log(`\nTotal orders now: ${finalOrders.length}`);
    console.log("Orders added successfully!");

  } catch (error) {
    console.error("Error adding orders:", error);
    process.exit(1);
  }
}

addOrders();
