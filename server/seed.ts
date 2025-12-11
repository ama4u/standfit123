import { db } from "./db";
import { storage } from "./storage";
import { sql } from "drizzle-orm";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create a default admin user
    const adminExists = await storage.getAdminUser("standfit2025@standfit.com");
    if (!adminExists) {
      await storage.createAdminUser({
        email: "standfit2025@standfit.com",
        password: "Standfit@1447",
        firstName: "Standfit",
        lastName: "Admin",
        role: "admin",
      });
      console.log("✓ Default admin created (standfit2025@standfit.com / Standfit@1447)");
    }

    // Create a test user
    let testUser = await storage.getUserByEmail("test@example.com");
    if (!testUser) {
      testUser = await storage.createUser({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
        phoneNumber: "+1234567890",
        contactAddress: "123 Test Street, Lagos, Nigeria",
      });
      console.log("✓ Test user created (test@example.com / password123)");
    } else {
      console.log("✓ Test user already exists");
    }

    // Create categories
    const categories = await storage.getCategories();
    if (categories.length === 0) {
      const categoryData = [
        { name: "Rice & Grains", description: "Premium rice varieties and grains", icon: "🌾", slug: "rice-grains" },
        { name: "Beans & Legumes", description: "Quality beans and legumes", icon: "🫘", slug: "beans-legumes" },
        { name: "Oils & Fats", description: "Cooking oils and palm oil", icon: "🛢️", slug: "oils-fats" },
        { name: "Spices & Seasonings", description: "Local and imported spices", icon: "🌶️", slug: "spices-seasonings" },
        { name: "Beverages", description: "Drinks and beverage supplies", icon: "☕", slug: "beverages" },
      ];

      for (const cat of categoryData) {
        await storage.createCategory(cat);
      }
      console.log("✓ Sample categories created");
    }

    // Create products
    const products = await storage.getProducts();
    if (products.length === 0) {
      const cats = await storage.getCategories();
      const riceCategory = cats.find(c => c.slug === "rice-grains");
      const beansCategory = cats.find(c => c.slug === "beans-legumes");
      const oilsCategory = cats.find(c => c.slug === "oils-fats");
      const spicesCategory = cats.find(c => c.slug === "spices-seasonings");

      const productData = [
        // Rice products
        { name: "Premium Thai Rice", description: "Long grain fragrant rice", price: 45000, wholesalePrice: 42000, unit: "per 50kg bag", categoryId: riceCategory?.id, inStock: true, featured: true, isLocallyMade: false },
        { name: "Nigerian Ofada Rice", description: "Locally grown brown rice", price: 38000, wholesalePrice: 35000, unit: "per 50kg bag", categoryId: riceCategory?.id, inStock: true, featured: true, isLocallyMade: true },
        { name: "Basmati Rice", description: "Premium quality basmati rice", price: 52000, wholesalePrice: 48000, unit: "per 50kg bag", categoryId: riceCategory?.id, inStock: true, featured: false, isLocallyMade: false },
        
        // Beans products
        { name: "Brown Beans", description: "Quality honey beans", price: 32000, wholesalePrice: 29000, unit: "per 50kg bag", categoryId: beansCategory?.id, inStock: true, featured: true, isLocallyMade: true },
        { name: "White Beans", description: "Premium white beans", price: 35000, wholesalePrice: 32000, unit: "per 50kg bag", categoryId: beansCategory?.id, inStock: true, featured: false, isLocallyMade: true },
        
        // Oils products
        { name: "Palm Oil (25 Liters)", description: "Pure red palm oil", price: 45000, wholesalePrice: 42000, unit: "per 25L container", categoryId: oilsCategory?.id, inStock: true, featured: true, isLocallyMade: true },
        { name: "Groundnut Oil (25 Liters)", description: "Pure groundnut cooking oil", price: 52000, wholesalePrice: 48000, unit: "per 25L container", categoryId: oilsCategory?.id, inStock: true, featured: false, isLocallyMade: true },
        { name: "Vegetable Oil (25 Liters)", description: "Refined vegetable oil", price: 48000, wholesalePrice: 45000, unit: "per 25L container", categoryId: oilsCategory?.id, inStock: true, featured: true, isLocallyMade: false },
        
        // Spices products
        { name: "Curry Powder (1kg)", description: "Blended curry spice", price: 3500, wholesalePrice: 3200, unit: "per kg", categoryId: spicesCategory?.id, inStock: true, featured: false, isLocallyMade: false },
        { name: "Ground Pepper (1kg)", description: "Hot pepper powder", price: 4500, wholesalePrice: 4200, unit: "per kg", categoryId: spicesCategory?.id, inStock: true, featured: false, isLocallyMade: true },
      ];

      for (const prod of productData) {
        await storage.createProduct(prod);
      }
      console.log("✓ Sample products created");
    }

    // Create sample orders
    if (testUser) {
      const existingOrders = await storage.getOrdersByUser(testUser.id);
      console.log(`Found ${existingOrders.length} existing orders for test user`);
      
      if (existingOrders.length === 0) {
        const allProducts = await storage.getProducts();
        
        if (allProducts.length > 0) {
          // Order 1 - Completed
          const order1Items = [
            { productId: allProducts[0].id, quantity: 10, priceAtOrder: allProducts[0].price },
            { productId: allProducts[3].id, quantity: 5, priceAtOrder: allProducts[3].price },
          ];
          const order1Total = order1Items.reduce((sum, item) => sum + (item.quantity * item.priceAtOrder), 0);
          
          await storage.createOrder({
            userId: testUser.id,
            totalAmount: order1Total,
            status: "completed",
            shippingAddress: testUser.contactAddress || "123 Test Street, Lagos",
            paymentMethod: "bank_transfer",
            paymentStatus: "paid",
          }, order1Items);

          // Order 2 - Processing
          const order2Items = [
            { productId: allProducts[1].id, quantity: 8, priceAtOrder: allProducts[1].price },
            { productId: allProducts[5].id, quantity: 3, priceAtOrder: allProducts[5].price },
          ];
          const order2Total = order2Items.reduce((sum, item) => sum + (item.quantity * item.priceAtOrder), 0);
          
          await storage.createOrder({
            userId: testUser.id,
            totalAmount: order2Total,
            status: "processing",
            shippingAddress: testUser.contactAddress || "123 Test Street, Lagos",
            paymentMethod: "cash_on_delivery",
            paymentStatus: "pending",
          }, order2Items);

          // Order 3 - Pending
          const order3Items = [
            { productId: allProducts[2].id, quantity: 15, priceAtOrder: allProducts[2].price },
          ];
          const order3Total = order3Items.reduce((sum, item) => sum + (item.quantity * item.priceAtOrder), 0);
          
          await storage.createOrder({
            userId: testUser.id,
            totalAmount: order3Total,
            status: "pending",
            shippingAddress: testUser.contactAddress || "123 Test Street, Lagos",
            paymentMethod: "bank_transfer",
            paymentStatus: "pending",
          }, order3Items);

          console.log("✓ Sample orders created (3 orders)");
        }
      } else {
        console.log("✓ Sample orders already exist");
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
