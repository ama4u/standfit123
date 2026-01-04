import {
  users,
  adminUsers,
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
  type User,
  type UpsertUser,
  type InsertUser,
  type AdminUser,
  type InsertAdminUser,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: InsertUser & { password: string }): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  setPasswordResetToken(email: string, token: string, expires: Date): Promise<void>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  clearPasswordResetToken(userId: string): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  
  // Order operations
  getOrders(): Promise<(Order & { user: User, items: (OrderItem & { product: Product })[] })[]>;
  getOrdersByUser(userId: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  getOrder(id: string): Promise<(Order & { user: User, items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<void>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  
  // Reports
  getReports(): Promise<{
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    recentOrders: Order[];
  }>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
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
  getActiveWeeklyDeals(): Promise<(WeeklyDeal & { product: Product })[]>;
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
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class DatabaseStorage implements IStorage {
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

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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

  async setPasswordResetToken(email: string, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: token, 
        resetPasswordExpires: expires,
        updatedAt: new Date() 
      })
      .where(eq(users.email, email));
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.resetPasswordToken, token),
          gte(users.resetPasswordExpires, new Date())
        )
      );
    return user;
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        resetPasswordToken: null, 
        resetPasswordExpires: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  // Order operations
  async getOrders(): Promise<(Order & { user: User, items: (OrderItem & { product: Product })[] })[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    
    const ordersWithDetails = await Promise.all(
      allOrders.map(async (order) => {
        const [user] = await db.select().from(users).where(eq(users.id, order.userId));
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

        return { ...order, user, items: itemsWithProducts };
      })
    );

    return ordersWithDetails;
  }

  async getOrdersByUser(userId: string): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
    
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
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

    return ordersWithItems;
  }

  async getOrder(id: string): Promise<(Order & { user: User, items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const [user] = await db.select().from(users).where(eq(users.id, order.userId));
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        return { ...item, product };
      })
    );

    return { ...order, user, items: itemsWithProducts };
  }

  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    
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

  // Reports
  async getReports(): Promise<{
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    recentOrders: Order[];
  }> {
    const allOrders = await db.select().from(orders);
    const totalSales = allOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = allOrders.length;
    
    const allUsers = await db.select().from(users);
    const totalUsers = allUsers.length;
    
    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    return {
      totalSales,
      totalOrders,
      totalUsers,
      recentOrders,
    };
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
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
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));
    
    return result.map(row => ({
      ...row,
      category: row.category.id ? row.category : null
    }));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
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
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.categoryId, categoryId))
      .orderBy(desc(products.createdAt));
    
    return result.map(row => ({
      ...row,
      category: row.category.id ? row.category : null
    }));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
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
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt));
    
    return result.map(row => ({
      ...row,
      category: row.category.id ? row.category : null
    }));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db
      .select({
        id: products.id,
        name: products.name,
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
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));
    
    if (result.length === 0) return undefined;
    
    const row = result[0];
    return {
      ...row,
      category: row.category.id ? row.category : null
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
    await db.delete(products).where(eq(products.id, id));
  }

  // Weekly deals operations
  async getActiveWeeklyDeals(): Promise<(WeeklyDeal & { product: Product })[]> {
    const now = new Date();
    return await db
      .select({
        id: weeklyDeals.id,
        productId: weeklyDeals.productId,
        discountPercentage: weeklyDeals.discountPercentage,
        salePrice: weeklyDeals.salePrice,
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
          gte(weeklyDeals.endDate, now),
          lte(weeklyDeals.startDate, now)
        )
      );
  }

  async createWeeklyDeal(deal: InsertWeeklyDeal): Promise<WeeklyDeal> {
    const [newDeal] = await db.insert(weeklyDeals).values(deal).returning();
    return newDeal;
  }

  // Store locations operations
  async getStoreLocations(): Promise<StoreLocation[]> {
    return await db.select().from(storeLocations);
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
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
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
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
}

export const storage = new DatabaseStorage();
