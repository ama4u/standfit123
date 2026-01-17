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
        { name: "Noodles", description: "Instant noodles and pasta", icon: "🍜", slug: "noodles" },
        { name: "Biscuits & Snacks", description: "Biscuits, wafers and snacks", icon: "🍪", slug: "biscuits-snacks" },
        { name: "Detergents & Soaps", description: "Cleaning and laundry products", icon: "🧼", slug: "detergents-soaps" },
        { name: "Sugar & Sweeteners", description: "Sugar and sweeteners", icon: "🍚", slug: "sugar-sweeteners" },
        { name: "Tomato & Pastes", description: "Tomato pastes and mixes", icon: "🍅", slug: "tomato-pastes" },
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
      const riceCategory = cats.find((c: any) => c.slug === "rice-grains");
      const beansCategory = cats.find((c: any) => c.slug === "beans-legumes");
      const oilsCategory = cats.find((c: any) => c.slug === "oils-fats");
      const spicesCategory = cats.find((c: any) => c.slug === "spices-seasonings");
      const beveragesCategory = cats.find((c: any) => c.slug === "beverages");
      const noodlesCategory = cats.find((c: any) => c.slug === "noodles");
      const biscuitsCategory = cats.find((c: any) => c.slug === "biscuits-snacks");
      const detergentsCategory = cats.find((c: any) => c.slug === "detergents-soaps");
      const sugarCategory = cats.find((c: any) => c.slug === "sugar-sweeteners");
      const tomatoCategory = cats.find((c: any) => c.slug === "tomato-pastes");

      // Build product list and ensure missing items are created (idempotent)
      const productData = [
        // Noodles
        { name: "Indomitable Noodles", description: "Indomitable pack", price: 9300, unit: "per pack", categoryId: noodlesCategory?.id, inStock: true },
        { name: "Super Pack Noodles", description: "Super pack", price: 14400, unit: "per pack", categoryId: noodlesCategory?.id, inStock: true },
        { name: "Hungry Man Noodles", description: "Hungry Man pack", price: 13200, unit: "per pack", categoryId: noodlesCategory?.id, inStock: true },
        { name: "120g Supreme Noodles", description: "120g supreme", price: 12700, unit: "120g", categoryId: noodlesCategory?.id, inStock: true },
        { name: "70g Supreme Noodles", description: "70g supreme", price: 7900, unit: "70g", categoryId: noodlesCategory?.id, inStock: true },
        { name: "70g Onion Indomitable", description: "70g onion flavor", price: 10200, unit: "70g", categoryId: noodlesCategory?.id, inStock: true },

        // Rice
        { name: "Optimum Rice", description: "Optimum premium rice", price: 52500, unit: "per 50kg", categoryId: riceCategory?.id, inStock: true },
        { name: "Umza Rice", description: "Umza brand rice", price: 50500, unit: "per 50kg", categoryId: riceCategory?.id, inStock: true },
        { name: "Spaghetti Rice", description: "Spaghetti style rice (bulk)", price: 18900, unit: "per bag", categoryId: riceCategory?.id, inStock: true },

        // Oils
        { name: "G/p Soya Oil 1L", description: "G/p Soya oil 1 litre", price: 43000, unit: "1L", categoryId: oilsCategory?.id, inStock: true },
        { name: "G/p Soya Oil 4L", description: "G/p Soya oil 4 litres", price: 74000, unit: "4L", categoryId: oilsCategory?.id, inStock: true },
        { name: "Kings Veg Oil 25L", description: "Kings vegetable oil 25 liters", price: 65500, unit: "25L", categoryId: oilsCategory?.id, inStock: true },
        { name: "GoldenTerra Veg Oil 25L", description: "GoldenTerra vegetable oil 25 liters", price: 60000, unit: "25L", categoryId: oilsCategory?.id, inStock: true },
        { name: "Kings Veg Oil 3L", description: "Kings vegetable oil 3 liters", price: 60000, unit: "3L", categoryId: oilsCategory?.id, inStock: true },

        // Tomato & Seasoning
        { name: "Party Jollof Tomato Paste", description: "Tomato paste for party jollof", price: 8300, unit: "per can", categoryId: tomatoCategory?.id, inStock: true },
        { name: "Sonia Tomato", description: "Sonia tomato paste", price: 7400, unit: "per can", categoryId: tomatoCategory?.id, inStock: true },
        { name: "Onion and Pepper Mix", description: "Onion and pepper mix", price: 7400, unit: "per pack", categoryId: tomatoCategory?.id, inStock: true },
        { name: "Gino Tomato Mix", description: "Gino tomato mix", price: 7400, unit: "per pack", categoryId: tomatoCategory?.id, inStock: true },
        { name: "Cowbell Milk", description: "Cowbell milk (bulk)", price: 22500, unit: "per pack", categoryId: beveragesCategory?.id, inStock: true },
        { name: "Salt (80kg)", description: "Salt by 80", price: 8600, unit: "per bag", categoryId: spicesCategory?.id, inStock: true },
        { name: "Salt (20kg)", description: "Salt by 20", price: 8000, unit: "per bag", categoryId: spicesCategory?.id, inStock: true },
        { name: "Spaghetti Golden / Penny", description: "Golden/Penny spaghetti", price: 18900, unit: "per bag", categoryId: riceCategory?.id, inStock: true },
        { name: "Mai Kwabo Spaghetti", description: "Mai Kwabo brand spaghetti", price: 12500, unit: "per bag", categoryId: riceCategory?.id, inStock: true },

        // Beverages
        { name: "Peak 123 Pouch", description: "Peak powdered milk 123 pouch", price: 50000, unit: "per carton", categoryId: beveragesCategory?.id, inStock: true },
        { name: "Peak 14g Sachet", description: "14g peak sachet", price: 37500, unit: "per box", categoryId: beveragesCategory?.id, inStock: true },
        { name: "Peak 800g", description: "800g Peak milk", price: 53000, unit: "800g", categoryId: beveragesCategory?.id, inStock: true },
        { name: "3Crown 12g Sachet", description: "12g three crown sachet", price: 24000, unit: "per box", categoryId: beveragesCategory?.id, inStock: true },
        { name: "3Crown 320g", description: "320g three crown", price: 32500, unit: "320g", categoryId: beveragesCategory?.id, inStock: true },
        { name: "Peak Evaporated Milk (24)", description: "Peak evaporated milk by 24", price: 13500, unit: "per carton", categoryId: beveragesCategory?.id, inStock: true },
        { name: "Three Crown 59g Tetra Pack", description: "59g three crown tetra pack", price: 9600, unit: "59g", categoryId: beveragesCategory?.id, inStock: true },
        { name: "Peak 900g Tin", description: "900g peak tin", price: 125000, unit: "900g", categoryId: beveragesCategory?.id, inStock: true },
        { name: "Top Cafe Coffee", description: "Top cafe instant coffee", price: 20000, unit: "per pack", categoryId: beveragesCategory?.id, inStock: true },

        // Sugar
        { name: "Golden Penny Sugar 50kg", description: "Golden Penny 50kg sugar", price: 71000, unit: "50kg", categoryId: sugarCategory?.id, inStock: true },

        // Biscuits & Snacks (sample subset from list)
        { name: "Zoom Biscuit", description: "Zoom biscuit", price: 4000, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Tennis Ball", description: "Tennis ball biscuit", price: 4050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Choco Gems", description: "Choco gems", price: 8000, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Browny Choco", description: "Browny Choco (discounted)", price: 5500, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Cabin Lucky", description: "Cabin lucky", price: 3050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Digestive Chocolate", description: "Digestive chocolate", price: 8000, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Supreme Digestive", description: "Supreme Digestive", price: 5100, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Large Cabin", description: "Large cabin biscuit", price: 9500, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Rich Shortbread", description: "Rich shortbread", price: 6300, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Speady Cookies", description: "Speady cookies", price: 2050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Munchkins by 24 (big)", description: "Munchkins by 24", price: 8000, unit: "box", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Animal Kingdom", description: "Animal kingdom biscuit", price: 2900, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Teddy Bear", description: "Teddy bear biscuit", price: 2900, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Brixx Chocolate", description: "Brixx chocolate", price: 3050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Digestive Plus", description: "Digestive plus", price: 4050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Lunch Pack", description: "Lunch pack biscuit", price: 2050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Supreme Cabin", description: "Supreme cabin", price: 3050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Wheels Crunchy", description: "Wheels crunchy", price: 6100, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Xreme Grab & Go", description: "Xreme grab & go", price: 10100, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Ohhh x24", description: "Ohhh x24", price: 3900, unit: "box", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Choco King", description: "Choco king", price: 10050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Wafer x24 Cube Double Choco", description: "Wafer x24 cube double choco", price: 4100, unit: "box", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Espresso Crunchy", description: "Espresso crunchy", price: 6300, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Fish Cake x24", description: "Fish cake x24", price: 3900, unit: "box", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Malto Biscuits", description: "Malto biscuits", price: 3000, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Amore Biscuits", description: "Amore biscuits", price: 2050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Chin Chin Chocolate", description: "Chocolate chin chin", price: 7800, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Munchkin Chocolate by 60", description: "Munchkin chocolate 60pcs", price: 10100, unit: "box", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Double Decker", description: "Double decker biscuit", price: 4100, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Fortune Cabin", description: "Fortune cabin", price: 2050, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Mini Stixi", description: "Mini stixi", price: 7000, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Nice Biscuit", description: "Nice biscuit", price: 6100, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Supreme/Dig Choco Chip", description: "Supreme digestive choco chip", price: 6300, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Twist Chocolate", description: "Twist chocolate", price: 6300, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Wafer Flutes", description: "Wafer flutes", price: 6300, unit: "per pack", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Wafer Cubes by 48", description: "Wafer cubes 48", price: 4000, unit: "box", categoryId: biscuitsCategory?.id, inStock: true },
        { name: "Wafer Cube by 24", description: "Wafer cube 24", price: 4100, unit: "box", categoryId: biscuitsCategory?.id, inStock: true },

        // Detergents & Soaps
        { name: "Viva Plus 330g", description: "Viva plus 330g", price: 8200, unit: "330g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Viva Soap Pink 250g", description: "Viva soap pink 250g", price: 14500, unit: "250g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Viva Ankara Soap", description: "Viva Ankara soap", price: 12200, unit: "per bar", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Family Care 180g", description: "Family care soap 180g", price: 15700, unit: "180g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Fizz Detergent 170g", description: "Fizz detergent 170g", price: 7300, unit: "170g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Fizz Soap", description: "Fizz soap", price: 13900, unit: "per bar", categoryId: detergentsCategory?.id, inStock: true },
        { name: "MP 3 Multi Purpose", description: "MP 3 multiple purpose cleaner", price: 15900, unit: "per unit", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Viva Dish Wash 600ml", description: "Viva dish wash 600ml", price: 19000, unit: "600ml", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Viva Dish Wash 1000ml", description: "Viva dish wash 1000ml", price: 20500, unit: "1000ml", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Good Mama 170g", description: "Good mama 170g", price: 7500, unit: "170g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Good Mama 800g", description: "Good mama 800g", price: 9700, unit: "800g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Good Mama 45g", description: "Good mama 45g", price: 6200, unit: "45g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Soklin 800g", description: "Soklin 800g", price: 10500, unit: "800g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Soklin 20g", description: "Soklin 20g", price: 7250, unit: "20g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Soklin 40g", description: "Soklin 40g", price: 6850, unit: "40g", categoryId: detergentsCategory?.id, inStock: true },
        { name: "Protect 160g", description: "Protect 160g", price: 8350, unit: "160g", categoryId: detergentsCategory?.id, inStock: true },
      ];

      // Get currently existing products and create only missing ones
      const existingProducts = await storage.getProducts();
      let createdCount = 0;
      for (const prod of productData) {
        try {
          const exists = existingProducts.find((p: any) => (p.name || '').toLowerCase() === (prod.name || '').toLowerCase());
          if (!exists) {
            // ensure slug is generated for seed products
            const slug = (prod.name || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
            await storage.createProduct({ ...prod, slug });
             createdCount++;
             console.log(`Created product: ${prod.name}`);
          }
        } catch (err) {
          console.error("Failed to create product", prod.name, err);
        }
      }

      if (createdCount > 0) {
        console.log(`✓ ${createdCount} sample products created`);
      } else {
        console.log("✓ Sample products already exist or were previously created");
      }
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
