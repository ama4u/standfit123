// Migration script to transfer data from SQLite to PostgreSQL
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import Database from "better-sqlite3";
import postgres from "postgres";
import * as schemaSqlite from "./shared/schema.js";
import * as schemaPostgres from "./shared/schema-postgres.js";

// SQLite connection
const sqlite = new Database("./sqlite.db");
const dbSqlite = drizzleSqlite(sqlite, { schema: schemaSqlite });

// PostgreSQL connection
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(databaseUrl, {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
const dbPostgres = drizzlePostgres(client, { schema: schemaPostgres });

async function migrateData() {
  console.log('🚀 Starting migration from SQLite to PostgreSQL...\n');

  try {
    // 1. Migrate Admin Users
    console.log('👤 Migrating admin users...');
    const adminUsers = await dbSqlite.select().from(schemaSqlite.adminUsers);
    if (adminUsers.length > 0) {
      for (const admin of adminUsers) {
        await dbPostgres.insert(schemaPostgres.adminUsers).values({
          email: admin.email,
          password: admin.password,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
        }).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${adminUsers.length} admin users`);
    } else {
      console.log('ℹ️  No admin users to migrate');
    }

    // 2. Migrate Users
    console.log('👥 Migrating users...');
    const users = await dbSqlite.select().from(schemaSqlite.users);
    if (users.length > 0) {
      for (const user of users) {
        await dbPostgres.insert(schemaPostgres.users).values({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
          isVerified: user.isVerified,
        }).onConflictDoNothing();
      }
      console.log(`✅ Migrated ${users.length} users`);
    } else {
      console.log('ℹ️  No users to migrate');
    }

    // 3. Migrate Categories
    console.log('🏷️  Migrating categories...');
    const categories = await dbSqlite.select().from(schemaSqlite.categories);
    const categoryIdMap = new Map();
    
    if (categories.length > 0) {
      for (const category of categories) {
        const [newCategory] = await dbPostgres.insert(schemaPostgres.categories).values({
          name: category.name,
          description: category.description,
          slug: category.slug,
        }).returning();
        categoryIdMap.set(category.id, newCategory.id);
      }
      console.log(`✅ Migrated ${categories.length} categories`);
    } else {
      console.log('ℹ️  No categories to migrate');
    }

    // 4. Migrate Products
    console.log('📦 Migrating products...');
    const products = await dbSqlite.select().from(schemaSqlite.products);
    const productIdMap = new Map();
    
    if (products.length > 0) {
      for (const product of products) {
        const [newProduct] = await dbPostgres.insert(schemaPostgres.products).values({
          name: product.name,
          description: product.description,
          price: product.price,
          wholesalePrice: product.wholesalePrice,
          unit: product.unit,
          minOrderQuantity: product.minOrderQuantity,
          packageSize: product.packageSize,
          packageUnit: product.packageUnit,
          categoryId: product.categoryId ? categoryIdMap.get(product.categoryId) : null,
          imageUrl: product.imageUrl,
          isLocallyMade: product.isLocallyMade,
          inStock: product.inStock,
          featured: product.featured,
        }).returning();
        productIdMap.set(product.id, newProduct.id);
      }
      console.log(`✅ Migrated ${products.length} products`);
    } else {
      console.log('ℹ️  No products to migrate');
    }

    // 5. Migrate News Flash Items
    console.log('📰 Migrating news flash items...');
    const newsFlashItems = await dbSqlite.select().from(schemaSqlite.newsFlashItems);
    if (newsFlashItems.length > 0) {
      for (const item of newsFlashItems) {
        await dbPostgres.insert(schemaPostgres.newsFlashItems).values({
          title: item.title,
          url: item.url,
          mediaType: item.mediaType,
          content: item.content,
          publicId: item.publicId,
        });
      }
      console.log(`✅ Migrated ${newsFlashItems.length} news flash items`);
    } else {
      console.log('ℹ️  No news flash items to migrate');
    }

    // 6. Migrate Contact Messages
    console.log('📧 Migrating contact messages...');
    const contactMessages = await dbSqlite.select().from(schemaSqlite.contactMessages);
    if (contactMessages.length > 0) {
      for (const message of contactMessages) {
        await dbPostgres.insert(schemaPostgres.contactMessages).values({
          name: message.name,
          email: message.email,
          phone: message.phone,
          subject: message.subject,
          message: message.message,
          isRead: message.isRead,
        });
      }
      console.log(`✅ Migrated ${contactMessages.length} contact messages`);
    } else {
      console.log('ℹ️  No contact messages to migrate');
    }

    // 7. Migrate Orders
    console.log('🛒 Migrating orders...');
    const orders = await dbSqlite.select().from(schemaSqlite.orders);
    const orderIdMap = new Map();
    
    if (orders.length > 0) {
      for (const order of orders) {
        const [newOrder] = await dbPostgres.insert(schemaPostgres.orders).values({
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          billingAddress: order.billingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          notes: order.notes,
        }).returning();
        orderIdMap.set(order.id, newOrder.id);
      }
      console.log(`✅ Migrated ${orders.length} orders`);

      // 8. Migrate Order Items
      console.log('📋 Migrating order items...');
      const orderItems = await dbSqlite.select().from(schemaSqlite.orderItems);
      if (orderItems.length > 0) {
        for (const item of orderItems) {
          await dbPostgres.insert(schemaPostgres.orderItems).values({
            orderId: orderIdMap.get(item.orderId),
            productId: productIdMap.get(item.productId),
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder,
          });
        }
        console.log(`✅ Migrated ${orderItems.length} order items`);
      }
    } else {
      console.log('ℹ️  No orders to migrate');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Admin Users: ${adminUsers.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   News Flash Items: ${newsFlashItems.length}`);
    console.log(`   Contact Messages: ${contactMessages.length}`);
    console.log(`   Orders: ${orders.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
    sqlite.close();
  }
}

// Run migration
migrateData().catch(console.error);