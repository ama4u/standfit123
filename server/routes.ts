import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertCategorySchema } from "@shared/schema";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { requireAuth, requireAdmin, verifyPassword } from "./auth";
import { sendPasswordResetEmail } from "./email";
import { uploadImage, uploadVideo, uploadMedia, deleteFromCloudinary } from "./cloudinary";

// Single consolidated route registrar
export async function registerRoutes(app: Express): Promise<Server> {
  // Set up local image upload handling
  const uploadDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  // Ensure news_flash_items table exists early (development convenience)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require('better-sqlite3');
    const sqlite = new Database('./sqlite.db');
    sqlite.prepare(`CREATE TABLE IF NOT EXISTS news_flash_items (
      id TEXT PRIMARY KEY,
      title TEXT,
      url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at INTEGER
    )`).run();
    sqlite.close();
  } catch (err) {
    // ignore
  }
  const storageMulter = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname) || "";
      cb(null, `${unique}${ext}`);
    },
  });
  const upload = multer({
    storage: storageMulter,
    fileFilter: (_req, file, cb) => {
      if (/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype)) return cb(null, true);
      cb(new Error("Only image files are allowed"));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

  // Local media upload (fallback when Cloudinary is not configured)
  const uploadMediaLocal = multer({
    storage: storageMulter,
    fileFilter: (_req, file, cb) => {
      if (/^image\//i.test(file.mimetype)) return cb(null, true);
      if (/^video\/mp4$/i.test(file.mimetype)) return cb(null, true);
      cb(new Error("Only images and mp4 videos are allowed"));
    },
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  });



  // Check if Cloudinary is configured
  const hasCloudinaryCredentials = process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name';

  // Admin: upload a single image file (Cloudinary or local fallback)
  const imageUploadHandler = hasCloudinaryCredentials ? uploadImage : upload;
  app.post("/api/admin/upload", requireAdmin as any, imageUploadHandler.single("image"), (req, res) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    
    if (hasCloudinaryCredentials) {
      return res.json({ 
        filename: file.filename, 
        url: (file as any).path, // Cloudinary URL
        publicId: (file as any).public_id 
      });
    } else {
      return res.json({ 
        filename: file.filename, 
        url: `/uploads/${file.filename}` // Local URL
      });
    }
  });

  // Admin: upload image or video (Cloudinary or local fallback)
  const mediaUploadHandler = hasCloudinaryCredentials ? uploadMedia : uploadMediaLocal;
  app.post("/api/admin/upload-media", requireAdmin as any, mediaUploadHandler.single("file"), (req, res) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    
    if (hasCloudinaryCredentials) {
      return res.json({ 
        filename: file.filename, 
        url: (file as any).path, // Cloudinary URL
        publicId: (file as any).public_id,
        resourceType: (file as any).resource_type 
      });
    } else {
      return res.json({ 
        filename: file.filename, 
        url: `/uploads/${file.filename}`, // Local URL
        resourceType: file.mimetype.startsWith('video/') ? 'video' : 'image'
      });
    }
  });

  // Ensure news_flash_items table exists (simple fallback for development)
  try {
    // Use a direct sqlite connection to run a lightweight CREATE TABLE IF NOT EXISTS
    // This is only to make local development smoother; proper schema migrations should
    // be managed via drizzle-kit in production.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require('better-sqlite3');
    const sqlite = new Database('./sqlite.db');
    sqlite.prepare(`CREATE TABLE IF NOT EXISTS news_flash_items (
      id TEXT PRIMARY KEY,
      title TEXT,
      url TEXT NOT NULL,
      media_type TEXT NOT NULL,
      created_at INTEGER
    )`).run();
    sqlite.close();
  } catch (err) {
    // ignore - if we cannot create it here, the storage layer will report errors
  }
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // (Optional) Get single category by id - not widely used by client, but kept for completeness
  app.get("/api/categories/:id", async (req, res) => {
    const id = req.params.id;
    const categories = await storage.getCategories();
    const category = categories.find((c: any) => c.id === id);
    if (!category) return res.status(404).send("Category not found");
    res.json(category);
  });

  app.get("/api/products", async (req, res) => {
    const categoryId = req.query.categoryId as string | undefined;
    const products = categoryId
      ? await storage.getProductsByCategory(categoryId)
      : await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = req.params.id;
    const product = await storage.getProduct(id);
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  });

  app.get("/api/weekly-deals", async (_req, res) => {
    const weeklyDeals = await storage.getActiveWeeklyDeals();
    res.json(weeklyDeals);
  });

  app.get("/api/blog-posts", async (_req, res) => {
    const blogPosts = await storage.getPublishedBlogPosts();
    res.json(blogPosts);
  });

  // Use slug for blog post details
  app.get("/api/blog-posts/:slug", async (req, res) => {
    const slug = req.params.slug;
    const post = await storage.getBlogPost(slug);
    if (!post) return res.status(404).send("Blog post not found");
    res.json(post);
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Categories CRUD
  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  app.get("/api/admin/categories", requireAdmin, async (_req, res) => {
    const cats = await storage.getCategories();
    res.json(cats);
  });

  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const data = req.body || {};
      // Auto-generate slug if not provided
      const payload = { ...data, slug: data.slug || slugify(data.name || "") };
      const validated = insertCategorySchema.parse(payload);
      const category = await storage.createCategory(validated);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body || {};
      // Allow updating slug if name changes and slug omitted
      const patch = { ...data };
      if (!patch.slug && patch.name) patch.slug = slugify(patch.name);
      const category = await storage.updateCategory(id, patch);
      if (!category) return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteCategory(id);
      res.json({ message: "Category deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/contact-messages", async (_req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  app.get("/api/store-locations", async (_req, res) => {
    const locations = await storage.getStoreLocations();
    res.json(locations);
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user || !(await verifyPassword(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isWholesaleCustomer: user.isWholesaleCustomer });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User Registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phoneNumber, isWholesaleCustomer } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await storage.createUser({ 
        email, 
        password, 
        firstName, 
        lastName, 
        phoneNumber: phoneNumber || null, 
        contactAddress: null,
        isWholesaleCustomer: isWholesaleCustomer || false
      });
      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Login
  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await storage.getAdminUser(email);
      if (!admin || !(await verifyPassword(password, admin.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.adminId = admin.id;
      res.json({ id: admin.id, email: admin.email, firstName: admin.firstName, lastName: admin.lastName });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Forgot Password - Send reset link to email
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // For security, don't reveal if email exists or not
        return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

      // Save token to database
      await storage.setPasswordResetToken(email, resetToken, resetExpires);

      // Send email with reset link
      try {
        await sendPasswordResetEmail(email, resetToken, user.firstName || "User");
        res.json({ message: "If an account with that email exists, a password reset link has been sent." });
      } catch (emailError: any) {
        console.error("Email error:", emailError);
        return res.status(500).json({ message: "Failed to send reset email. Please try again or contact support." });
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  });

  // Reset Password - Validate token and update password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Find user by valid token
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset token
      await storage.updatePassword(user.id, hashedPassword);
      await storage.clearPasswordResetToken(user.id);

      res.json({ message: "Password successfully reset. You can now log in with your new password." });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  });

  // Get Current User
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    res.json(req.user);
  });

  // Get Current Admin
  app.get("/api/auth/admin/me", requireAdmin, async (req, res) => {
    const admin = await storage.getAdminUser(req.user!.email);
    res.json(admin);
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Failed to logout" });
      res.json({ message: "Logged out successfully" });
    });
  });

  // Admin: Get all users
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  // Admin: Get single user
  app.get("/api/admin/users/:id", requireAdmin, async (req, res) => {
    const id = req.params.id;
    const user = await storage.getUser(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  // Admin: Update user
  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await storage.updateUser(id, req.body);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Delete user
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all orders
  app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  // Admin: Get single order
  app.get("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    const id = req.params.id;
    const order = await storage.getOrder(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  // Admin: Update order status
  app.patch("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      if (!status || !["pending", "processing", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const order = await storage.updateOrderStatus(id, status);
      if (!order) return res.status(404).json({ message: "Order not found" });
      await storage.createNotification({ userId: order.userId, title: "Order Update", message: `Your order #${order.id} status has been updated to ${status}`, type: "order_update" });
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Delete order
  app.delete("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteOrder(id);
      res.json({ message: "Order deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get reports
  app.get("/api/admin/reports", requireAdmin, async (_req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  // Admin: Send notification
  app.post("/api/admin/notifications", requireAdmin, async (req, res) => {
    try {
      const { title, message, type } = req.body;
      const notification = await storage.createNotification({ 
        userId: null, // Admin notifications don't need a specific user
        title: title || "Message from Admin", 
        message, 
        type: type || "admin_message" 
      });
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Create product
  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Public: get news flash items
  app.get("/api/newsflash", async (_req, res) => {
    const items = await storage.getNewsFlashItems();
    res.json(items);
  });

  // Admin: create news flash item
  app.post("/api/admin/newsflash", requireAdmin, async (req, res) => {
    try {
      const { title, url, mediaType, content, message, publicId } = req.body;
      
      if (mediaType === 'text') {
        // Text-only news flash - accept both 'content' and 'message' for backward compatibility
        const textContent = content || message;
        if (!textContent) return res.status(400).json({ message: "content required for text posts" });
        const item = await storage.createNewsFlashItem({ 
          title: title || "News Update", 
          url: null, 
          mediaType: 'text',
          content: textContent,
          publicId: null
        });
        res.json(item);
      } else {
        // Media news flash
        if (!url || !mediaType) return res.status(400).json({ message: "url and mediaType required for media posts" });
        const item = await storage.createNewsFlashItem({ 
          title: title || null, 
          url, 
          mediaType,
          content: null,
          publicId: publicId || null
        });
        res.json(item);
      }
    } catch (error: any) {
      console.error("Error creating news flash item:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: delete news flash item
  app.delete("/api/admin/newsflash/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      
      // Get the item first to get the publicId for Cloudinary deletion
      const items = await storage.getNewsFlashItems();
      const item = items.find((i: any) => i.id === id);
      
      if (item && item.publicId) {
        // Delete from Cloudinary
        const resourceType = item.mediaType === 'video' ? 'video' : 'image';
        await deleteFromCloudinary(item.publicId, resourceType);
      }
      
      // Delete from database
      await storage.deleteNewsFlashItem(id);
      res.json({ message: "Deleted from both Cloudinary and database" });
    } catch (error: any) {
      console.error("Delete error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Update product
  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const product = await storage.updateProduct(id, req.body);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Delete product
  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User: Get profile
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    res.json(req.user);
  });

  // User: Update profile
  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { firstName, lastName, phoneNumber, contactAddress } = req.body;
      const user = await storage.updateUser(userId, { firstName, lastName, phoneNumber, contactAddress });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User: Get orders
  app.get("/api/user/orders", requireAuth, async (req, res) => {
    const userId = req.session.userId!;
    const orders = await storage.getOrdersByUser(userId);
    res.json(orders);
  });

  // User: Get single order
  app.get("/api/user/orders/:id", requireAuth, async (req, res) => {
    const id = req.params.id;
    const userId = req.session.userId!;
    const order = await storage.getOrder(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId !== userId) return res.status(403).json({ message: "Unauthorized" });
    res.json(order);
  });

  // User: Create order
  app.post("/api/user/orders", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { items, shippingAddress, paymentMethod, notes } = req.body as {
        items: { productId: string; quantity: number }[];
        shippingAddress: string;
        paymentMethod?: string;
        notes?: string;
      };

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order items are required" });
      }

      const resolvedItems = [] as { productId: string; quantity: number; priceAtPurchase: number; subtotal: number }[];
      let totalAmount = 0;
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (!product) return res.status(400).json({ message: `Product ${item.productId} not found` });
        const price = Number(product.price);
        const subtotal = price * item.quantity;
        totalAmount += subtotal;
        resolvedItems.push({ productId: item.productId, quantity: item.quantity, priceAtPurchase: price, subtotal });
      }

      const order = await storage.createOrder(
        {
          userId,
          totalAmount,
          status: "pending",
          shippingAddress: shippingAddress || "",
          paymentMethod: paymentMethod || null,
          notes: notes || null,
        },
        resolvedItems
      );

      await storage.createNotification({ userId, title: "Order Placed", message: `Your order #${order.id} has been placed successfully`, type: "order_update" });
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User: Get notifications
  app.get("/api/user/notifications", requireAuth, async (req, res) => {
    const userId = req.session.userId!;
    const notifications = await storage.getNotifications(userId);
    res.json(notifications);
  });

  // User: Mark notification as read
  app.patch("/api/user/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.markNotificationAsRead(id);
      res.json({ message: "Notification marked as read" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
