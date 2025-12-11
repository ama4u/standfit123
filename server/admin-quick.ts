import { db } from "./db";
import { adminUsers } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Quick script to add, update, or delete an admin
 * 
 * Usage examples:
 * Add admin:    npm run admin:quick -- add email@example.com password123 "John" "Doe"
 * Update:       npm run admin:quick -- update email@example.com --password newpass123
 * Update name:  npm run admin:quick -- update email@example.com --firstname "Jane" --lastname "Smith"
 * Delete:       npm run admin:quick -- delete email@example.com
 * List:         npm run admin:quick -- list
 */

const args = process.argv.slice(2);
const command = args[0];

async function listAdmins() {
  console.log("\n📋 Current Admins:\n");
  const admins = await db.select().from(adminUsers);
  
  if (admins.length === 0) {
    console.log("No admins found.");
    return;
  }
  
  admins.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.firstName} ${admin.lastName}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt?.toLocaleDateString()}`);
    console.log("");
  });
}

async function addAdmin(email: string, password: string, firstName?: string, lastName?: string) {
  if (!email || !password) {
    console.error("❌ Email and password are required!");
    console.log("Usage: npm run admin:quick -- add email@example.com password123 [FirstName] [LastName]");
    process.exit(1);
  }
  
  // Check if admin already exists
  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (existing) {
    console.error("❌ Admin with this email already exists!");
    process.exit(1);
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [newAdmin] = await db.insert(adminUsers).values({
    email,
    password: hashedPassword,
    firstName: firstName || null,
    lastName: lastName || null,
    role: "admin",
  }).returning();
  
  console.log("✅ Admin added successfully!");
  console.log(`   Email: ${newAdmin.email}`);
  console.log(`   Name: ${newAdmin.firstName} ${newAdmin.lastName}`);
  console.log(`   ID: ${newAdmin.id}`);
}

async function updateAdmin(email: string, updates: Record<string, any>) {
  if (!email) {
    console.error("❌ Email is required!");
    console.log("Usage: npm run admin:quick -- update email@example.com --password newpass --firstname John");
    process.exit(1);
  }
  
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (!admin) {
    console.error("❌ Admin not found!");
    process.exit(1);
  }
  
  const updateData: any = { updatedAt: new Date() };
  
  if (updates.password) {
    updateData.password = await bcrypt.hash(updates.password, 10);
  }
  if (updates.firstname) updateData.firstName = updates.firstname;
  if (updates.lastname) updateData.lastName = updates.lastname;
  if (updates.email) {
    // Check if new email already exists
    const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, updates.email));
    if (existing && existing.id !== admin.id) {
      console.error("❌ Another admin with this email already exists!");
      process.exit(1);
    }
    updateData.email = updates.email;
  }
  
  await db
    .update(adminUsers)
    .set(updateData)
    .where(eq(adminUsers.id, admin.id));
  
  console.log("✅ Admin updated successfully!");
  console.log(`   Email: ${updateData.email || admin.email}`);
}

async function deleteAdmin(email: string) {
  if (!email) {
    console.error("❌ Email is required!");
    console.log("Usage: npm run admin:quick -- delete email@example.com");
    process.exit(1);
  }
  
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (!admin) {
    console.error("❌ Admin not found!");
    process.exit(1);
  }
  
  await db.delete(adminUsers).where(eq(adminUsers.id, admin.id));
  console.log("✅ Admin deleted successfully!");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name: ${admin.firstName} ${admin.lastName}`);
}

async function main() {
  if (!command) {
    console.log("\n🔧 Admin Quick Management Tool\n");
    console.log("Usage:");
    console.log("  List admins:");
    console.log("    npm run admin:quick -- list\n");
    console.log("  Add admin:");
    console.log("    npm run admin:quick -- add email@example.com password123 John Doe\n");
    console.log("  Update admin password:");
    console.log("    npm run admin:quick -- update email@example.com --password newpass123\n");
    console.log("  Update admin name:");
    console.log("    npm run admin:quick -- update email@example.com --firstname Jane --lastname Smith\n");
    console.log("  Update admin email:");
    console.log("    npm run admin:quick -- update old@example.com --email new@example.com\n");
    console.log("  Delete admin:");
    console.log("    npm run admin:quick -- delete email@example.com\n");
    process.exit(0);
  }
  
  switch (command.toLowerCase()) {
    case "list":
      await listAdmins();
      break;
      
    case "add":
      await addAdmin(args[1], args[2], args[3], args[4]);
      break;
      
    case "update": {
      const email = args[1];
      const updates: Record<string, any> = {};
      
      for (let i = 2; i < args.length; i++) {
        if (args[i].startsWith("--")) {
          const key = args[i].substring(2);
          const value = args[i + 1];
          if (value && !value.startsWith("--")) {
            updates[key] = value;
            i++;
          }
        }
      }
      
      await updateAdmin(email, updates);
      break;
    }
      
    case "delete":
      await deleteAdmin(args[1]);
      break;
      
    default:
      console.error("❌ Invalid command!");
      console.log("Valid commands: list, add, update, delete");
      process.exit(1);
  }
  
  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
