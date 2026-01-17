import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./db-postgres";
import {
  adminUsers,
  users,
  categories,
  products,
  weeklyDeals,
  storeLocations,
  blogPosts,
  newsFlashItems,
  contactMessages,
  orders,
  orderItems,
  notifications,
  type AdminUser,
  type InsertAdminUser,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type WeeklyDeal,
  type InsertWeeklyDeal,
  type StoreLocation,
  type InsertStoreLocation,
  type BlogPost,
  type InsertBlogPost,
  type NewsFlashItem,
  type InsertNewsFlashItem,
  type ContactMessage,
  type InsertContactMessage,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Notification,
  type InsertNotification,
} from "@shared/schema-postgres";

export interface IStorage {
  // Admin user operations
  getAdminUser(email: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: string): Promise<AdminUser | undefined>;
  createAdminUser(admin: InsertAdminUser & { password: string }): Promise<AdminUser>;
  updateAdminUser(id: string, data: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;
  
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser & { password: string }): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  
  // Weekly deals operations
  getActiveWeeklyDeals(): Promise<WeeklyDeal[]>;
  createWeeklyDeal(deal: InsertWeeklyDeal): Promise<WeeklyDeal>;
  
  // Store locations operations
  getStoreLocations(): Promise<StoreLocation[]>;
  createStoreLocation(location: InsertStoreLocation): Promise<StoreLocation>;
  
  // Blog operations
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // News flash operations
  getNewsFlashItems(): Promise<NewsFlashItem[]>;
  createNewsFlashItem(item: InsertNewsFlashItem): Promise<NewsFlashItem>;
  deleteNewsFlashItem(id: string): Promise<void>;
  
  // Contact operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  
  // Order operations
  getOrders(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  getOrder(id: string): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  getOrdersByUser(userId: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<void>;
  
  // Reports
  getReports(): Promise<any>;
}

export class PostgreSQLStorage implements IStorage {
  // Admin user operations
  async getAdminUser(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin;
  }

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return admin;
  }

  async createAdminUser(adminData: InsertAdminUser & { password: string }): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const { password, ...rest } = adminData;
    const [admin] = await db
      .insert(adminUsers)
      .values({
        ...rest,
        password: hashedPassword,
      })
      .returning();
    return admin;
  }

  async updateAdminUser(id: string, data: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const [admin] = await db
      .update(adminUsers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return admin;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(userData: InsertUser & { password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { password, ...rest } = userData;
    const [user] = await db
      .insert(users)
      .values({
        ...rest,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Password reset operations
  async setPasswordResetToken(email: string, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: token, 
        resetPasswordExpires: expiry,
        updatedAt: new Date()
      })
      .where(eq(users.email, email));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token));
    return user;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  async clearPasswordResetToken(id: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: null, 
        resetPasswordExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        wholesalePrice: products.wholesalePrice,
        unit: products.unit,
        minOrderQuantity: products.minOrderQuantity,
        packageSize: products.packageSize,
        packageUnit: products.packageUnit,
        categoryId: products.categoryId,
        imageUrl: products.imageUrl,
        isLocallyMade: products.isLocallyMade,
        inStock: products.inStock,
        featured: products.featured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        categoryDescription: categories.description,
        categorySlug: categories.slug
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.categoryId, categoryId))
      .orderBy(desc(products.createdAt));
    
    return result.map(row => ({
      id: row.id,
      name: row.name,
      slug: (row as any).slug,
      description: row.description,
      price: row.price,
      wholesalePrice: row.wholesalePrice,
      unit: row.unit,
      minOrderQuantity: row.minOrderQuantity,
      packageSize: row.packageSize,
      packageUnit: row.packageUnit,
      categoryId: row.categoryId,
      imageUrl: row.imageUrl,
      isLocallyMade: row.isLocallyMade,
      inStock: row.inStock,
      featured: row.featured,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: row.categoryName ? {
        id: row.categoryId!,
        name: row.categoryName,
        description: row.categoryDescription,
        slug: row.categorySlug!,
        createdAt: null,
        updatedAt: null
      } : null
    }));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        wholesalePrice: products.wholesalePrice,
        unit: products.unit,
        minOrderQuantity: products.minOrderQuantity,
        packageSize: products.packageSize,
        packageUnit: products.packageUnit,
        categoryId: products.categoryId,
        imageUrl: products.imageUrl,
        isLocallyMade: products.isLocallyMade,
        inStock: products.inStock,
        featured: products.featured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        categoryDescription: categories.description,
        categorySlug: categories.slug
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt));
    
    return result.map(row => ({
      id: row.id,
      name: row.name,
      slug: (row as any).slug,
      description: row.description,
      price: row.price,
      wholesalePrice: row.wholesalePrice,
      unit: row.unit,
      minOrderQuantity: row.minOrderQuantity,
      packageSize: row.packageSize,
      packageUnit: row.packageUnit,
      categoryId: row.categoryId,
      imageUrl: row.imageUrl,
      isLocallyMade: row.isLocallyMade,
      inStock: row.inStock,
      featured: row.featured,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: row.categoryName ? {
        id: row.categoryId!,
        name: row.categoryName,
        description: row.categoryDescription,
        slug: row.categorySlug!,
        createdAt: null,
        updatedAt: null
      } : null
    }));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        wholesalePrice: products.wholesalePrice,
        unit: products.unit,
        minOrderQuantity: products.minOrderQuantity,
        packageSize: products.packageSize,
        packageUnit: products.packageUnit,
        categoryId: products.categoryId,
        imageUrl: products.imageUrl,
        isLocallyMade: products.isLocallyMade,
        inStock: products.inStock,
        featured: products.featured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        categoryDescription: categories.description,
        categorySlug: categories.slug
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));
    
    if (result.length === 0) return undefined;
    
    const row = result[0];
    return {
      id: row.id,
      name: row.name,
      slug: (row as any).slug,
      description: row.description,
      price: row.price,
      wholesalePrice: row.wholesalePrice,
      unit: row.unit,
      minOrderQuantity: row.minOrderQuantity,
      packageSize: row.packageSize,
      packageUnit: row.packageUnit,
      categoryId: row.categoryId,
      imageUrl: row.imageUrl,
      isLocallyMade: row.isLocallyMade,
      inStock: row.inStock,
      featured: row.featured,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: row.categoryName ? {
        id: row.categoryId!,
        name: row.categoryName,
        description: row.categoryDescription,
        slug: row.categorySlug!,
        createdAt: null,
        updatedAt: null
      } : null
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      // Simple approach: try to get order items for this product
      const relatedOrderItems = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.productId, id))
        .limit(1); // We only need to know if any exist
      
      if (relatedOrderItems.length > 0) {
        // Get the actual count for the error message
        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(orderItems)
          .where(eq(orderItems.productId, id));
        
        const count = countResult[0]?.count || relatedOrderItems.length;
        throw new Error(`Cannot delete product: it is referenced in ${count} order(s). Consider marking it as inactive instead.`);
      }
      
      // If no order items found, safe to delete
      await db.delete(products).where(eq(products.id, id));
    } catch (error) {
      // Log the error for debugging
      console.error('Product deletion error:', error);
      throw error;
    }
  }

  // Weekly deals operations
  async getActiveWeeklyDeals(): Promise<WeeklyDeal[]> {
    const now = new Date();
    return await db
      .select({
        id: weeklyDeals.id,
        productId: weeklyDeals.productId,
        discountPercentage: weeklyDeals.discountPercentage,
        startDate: weeklyDeals.startDate,
        endDate: weeklyDeals.endDate,
        isActive: weeklyDeals.isActive,
        createdAt: weeklyDeals.createdAt,
        product: products,
      })
      .from(weeklyDeals)
      .innerJoin(products, eq(weeklyDeals.productId, products.id))
      .where(
        and(
          eq(weeklyDeals.isActive, true),
          lte(weeklyDeals.startDate, now),
          gte(weeklyDeals.endDate, now)
        )
      );
  }

  async createWeeklyDeal(deal: InsertWeeklyDeal): Promise<WeeklyDeal> {
    const [newDeal] = await db.insert(weeklyDeals).values(deal).returning();
    return newDeal;
  }

  // Store locations operations
  async getStoreLocations(): Promise<StoreLocation[]> {
    return await db.select().from(storeLocations).where(eq(storeLocations.isActive, true));
  }

  async createStoreLocation(location: InsertStoreLocation): Promise<StoreLocation> {
    const [newLocation] = await db.insert(storeLocations).values(location).returning();
    return newLocation;
  }

  // Blog operations
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  // News flash operations
  async getNewsFlashItems(): Promise<NewsFlashItem[]> {
    return await db.select().from(newsFlashItems).orderBy(desc(newsFlashItems.createdAt));
  }

  async createNewsFlashItem(item: InsertNewsFlashItem): Promise<NewsFlashItem> {
    const [newItem] = await db.insert(newsFlashItems).values(item).returning();
    return newItem;
  }

  async deleteNewsFlashItem(id: string): Promise<void> {
    await db.delete(newsFlashItems).where(eq(newsFlashItems.id, id));
  }

  // Contact operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async deleteNotification(id: string): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }

  // Order operations
  async getOrders(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const ordersData = await db.select().from(orders).orderBy(desc(orders.createdAt));
    
    return await Promise.all(
      ordersData.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const [product] = await db.select().from(products).where(eq(products.id, item.productId));
            return { ...item, product };
          })
        );

        return { ...order, items: itemsWithProducts };
      })
    );
  }

  async getOrdersByUser(userId: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const ordersData = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    
    return await Promise.all(
      ordersData.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const [product] = await db.select().from(products).where(eq(products.id, item.productId));
            return { ...item, product };
          })
        );

        return { ...order, items: itemsWithProducts };
      })
    );
  }

  async getOrder(id: string): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        return { ...item, product };
      })
    );

    return { ...order, items: itemsWithProducts };
  }

  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // If this order is associated with a registered user, and customer fields are missing,
    // fill them from the user's profile to satisfy NOT NULL constraints on the orders table.
    let payload: any = { ...orderData };
    if (orderData.userId && (!payload.customerName || !payload.customerEmail || !payload.customerPhone)) {
      const [user] = await db.select().from(users).where(eq(users.id, orderData.userId));
      if (user) {
        payload.customerName = payload.customerName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Customer';
        payload.customerEmail = payload.customerEmail || user.email || 'unknown@example.com';
        // Ensure a non-null phone value to satisfy NOT NULL constraint in orders table
        payload.customerPhone = payload.customerPhone || user.phoneNumber || '0000000000';
      }
    }

    const [order] = await db.insert(orders).values(payload).returning();
    
    const orderItemsData = items.map(item => ({
      ...item,
      orderId: order.id,
    }));
    
    await db.insert(orderItems).values(orderItemsData);
    
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
  }

  // Reports
  async getReports(): Promise<any> {
    try {
      // Use SQL aggregation instead of loading all data into memory
      const [salesResult, ordersCount, productsCount, usersCount, recentOrders] = await Promise.all([
        // Get total sales using SQL SUM
        db.select({ 
          totalSales: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` 
        }).from(orders),
        
        // Get counts using SQL COUNT
        db.select({ count: sql<number>`count(*)` }).from(orders),
        db.select({ count: sql<number>`count(*)` }).from(products),
        db.select({ count: sql<number>`count(*)` }).from(users),
        
        // Get recent orders with limit
        db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5)
      ]);

      return {
        totalSales: salesResult[0]?.totalSales || 0,
        totalOrders: ordersCount[0]?.count || 0,
        totalProducts: productsCount[0]?.count || 0,
        totalUsers: usersCount[0]?.count || 0,
        recentOrders: recentOrders,
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports data');
    }
  }
}

export const storage = new PostgreSQLStorage();