import {
  users,
  categories,
  products,
  weeklyDeals,
  storeLocations,
  blogPosts,
  contactMessages,
  type User,
  type UpsertUser,
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
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
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
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
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
