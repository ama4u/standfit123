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
import { gzipSync } from 'zlib';

// Single consolidated route registrar
export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      // Test database connection
      await storage.getCategories();
      res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        database: "connected"
      });
    } catch (error: any) {
      console.error("Health check failed:", error);
      res.status(503).json({ 
        status: "unhealthy", 
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

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
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const products = categoryId
        ? await storage.getProductsByCategory(categoryId)
        : await storage.getProducts();
      res.json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      res.status(503).json({ 
        message: "Service temporarily unavailable", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await storage.getProduct(id);
      if (!product) return res.status(404).send("Product not found");
      res.json(product);
    } catch (error: any) {
      console.error("Error fetching product:", error);
      res.status(503).json({ 
        message: "Service temporarily unavailable", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  });

  app.get("/api/weekly-deals", async (_req, res) => {
    try {
      const weeklyDeals = await storage.getActiveWeeklyDeals();
      res.json(weeklyDeals);
    } catch (error: any) {
      console.error("Error fetching weekly deals:", error);
      res.status(503).json({ 
        message: "Service temporarily unavailable", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
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
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const admin = await storage.getAdminUser(email);
      if (!admin || !(await verifyPassword(password, admin.password))) {
        console.log(`❌ Admin login failed for email: ${email}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.adminId = admin.id;
      console.log(`✅ Admin login success: ${admin.email} (Session: ${req.sessionID})`);
      
      res.json({ 
        id: admin.id, 
        email: admin.email, 
        firstName: admin.firstName, 
        lastName: admin.lastName,
        sessionId: req.sessionID
      });
    } catch (error: any) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Session Status
  app.get("/api/auth/admin/status", async (req, res) => {
    try {
      if (!req.session?.adminId) {
        return res.status(401).json({ 
          authenticated: false, 
          message: "No admin session",
          sessionId: req.sessionID
        });
      }
      
      const admin = await storage.getAdminUserById(req.session.adminId);
      if (!admin) {
        req.session.adminId = undefined;
        return res.status(401).json({ 
          authenticated: false, 
          message: "Admin not found",
          sessionId: req.sessionID
        });
      }
      
      res.json({ 
        authenticated: true,
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName
        },
        sessionId: req.sessionID
      });
    } catch (error: any) {
      console.error("Admin status check error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Logout
  app.post("/api/auth/admin/logout", (req, res) => {
    const sessionId = req.sessionID;
    req.session.destroy((err) => {
      if (err) {
        console.error("Admin logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      console.log(`✅ Admin logout success (Session: ${sessionId})`);
      res.json({ message: "Logged out successfully" });
    });
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

      // Find user with valid token
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
      const { status } = req.body as { status?: string };

      const validStatuses = ["pending", "processing", "completed", "cancelled"];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status", validStatuses });
      }

      const order = await storage.getOrder(id as string);
      if (!order) return res.status(404).json({ message: "Order not found" });

      const updatedOrder = await storage.updateOrderStatus(id as string, status);
      if (!updatedOrder) return res.status(500).json({ message: "Failed to update order status" });

      // Try to notify the user (don't fail the request if notification creation fails)
      try {
        if ((updatedOrder as any).userId) {
          await storage.createNotification({
            userId: (updatedOrder as any).userId,
            title: "Order Update",
            message: `Your order #${(updatedOrder as any).id.slice(0, 8)} status is now ${status}`,
            type: "order_update",
          });
        }
      } catch (notificationError) {
        console.error("Failed to create notification after order status update:", notificationError);
      }

      res.json(updatedOrder);
    } catch (error: any) {
      console.error("Order status update error:", error);
      res.status(500).json({ message: error.message || "Failed to update order status" });
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
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error: any) {
      console.error("Error fetching admin reports:", error);
      res.status(503).json({ 
        message: "Service temporarily unavailable", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
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
      const data = req.body || {};
      // Auto-generate slug from name if not provided
      if (!data.slug && data.name) data.slug = slugify(data.name);
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Update product
  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body || {};
      if (!data.slug && data.name) data.slug = slugify(data.name);
      const product = await storage.updateProduct(id, data);
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
      // If it's a business logic error (like foreign key constraint), send 400
      // If it's a system error, send 500
      if (error.message && error.message.includes("Cannot delete product")) {
        res.status(400).json({ message: error.message });
      } else {
        console.error("Unexpected product deletion error:", error);
        res.status(500).json({ message: error.message || "Failed to delete product" });
      }
    }
  });

  // Sitemap index and gzipped sitemaps

  app.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
      // sitemap index referencing two sitemaps
      const now = new Date().toISOString();
      const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${baseUrl}/sitemap-main.xml.gz</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${baseUrl}/sitemap-products.xml.gz</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n</sitemapindex>`;
      res.header('Content-Type', 'application/xml');
      res.send(indexXml);
    } catch (err) {
      console.error('Sitemap index error:', err);
      res.status(500).send('Failed to generate sitemap index');
    }
  });

  app.get('/sitemap-main.xml.gz', async (req, res) => {
    try {
      const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
      const pages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/products', priority: '0.9', changefreq: 'daily' },
        { url: '/contact', priority: '0.7', changefreq: 'weekly' },
        { url: '/blog', priority: '0.8', changefreq: 'daily' },
        { url: '/news-flash', priority: '0.7', changefreq: 'weekly' },
      ];
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (const p of pages) {
        xml += `  <url>\n    <loc>${baseUrl}${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
      }
      xml += '</urlset>';
      const gz = gzipSync(xml);
      res.header('Content-Type', 'application/xml');
      res.header('Content-Encoding', 'gzip');
      res.send(gz);
    } catch (error) {
      console.error('sitemap-main generation error:', error);
      res.status(500).send('Failed to generate sitemap');
    }
  });

  app.get('/sitemap-products.xml.gz', async (req, res) => {
    try {
      const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
      const products = (await storage.getProducts()) || [];
      const posts = (await storage.getPublishedBlogPosts()) || [];
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      for (const prod of products) {
        const lastmod = prod.updatedAt || prod.createdAt ? new Date(prod.updatedAt || prod.createdAt!).toISOString() : new Date().toISOString();
        // prefer slug if available
        const slugOrId = prod.slug || prod.id;
        xml += `  <url>\n    <loc>${baseUrl}/products/${slugOrId}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }
      for (const post of posts) {
        const lastmod = post.updatedAt || post.publishedAt || post.createdAt ? new Date(post.updatedAt || post.publishedAt || post.createdAt!).toISOString() : new Date().toISOString();
        const slug = post.slug || (post.id || '');
        xml += `  <url>\n    <loc>${baseUrl}/blog/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }
      xml += '</urlset>';
      const gz = gzipSync(xml);
      res.header('Content-Type', 'application/xml');
      res.header('Content-Encoding', 'gzip');
      res.send(gz);
    } catch (error) {
      console.error('sitemap-products generation error:', error);
      res.status(500).send('Failed to generate sitemap');
    }
  });

  // Admin: submit sitemap to search engines (ping) - protected
  app.post('/api/admin/sitemap/submit', requireAdmin, async (req, res) => {
    try {
      const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
      const sitemapUrl = `${baseUrl}/sitemap.xml`;
      const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

      const fetchFn = (globalThis as any).fetch ?? (await import('node-fetch')).default;
      const results = await Promise.allSettled([
        fetchFn(googlePing),
        fetchFn(bingPing),
      ]);

      res.json({ message: 'Pinged search engines', results: results.map(r => ({ status: r.status })) });
    } catch (error) {
      console.error('Sitemap submit error:', error);
      res.status(500).json({ message: 'Failed to submit sitemap' });
    }
  });

  app.get('/health', async (_req, res) => {
    try {
      // quick DB check (avoid heavy queries)
      let dbOk = true;
      try {
        // try a very small query depending on storage implementation
        const cats = await storage.getCategories();
        dbOk = Array.isArray(cats);
      } catch (e) {
        dbOk = false;
      }

      res.json({ status: 'ok', db: dbOk, env: process.env.NODE_ENV || 'unknown' });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message || String(err) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
