import { db } from "./db";
import { adminUsers } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

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
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt?.toLocaleDateString()}`);
    console.log("");
  });
}

async function addAdmin() {
  console.log("\n➕ Add New Admin\n");
  
  const email = await question("Email: ");
  const password = await question("Password: ");
  const firstName = await question("First Name: ");
  const lastName = await question("Last Name: ");
  
  if (!email || !password) {
    console.log("❌ Email and password are required!");
    return;
  }
  
  // Check if admin already exists
  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (existing) {
    console.log("❌ Admin with this email already exists!");
    return;
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await db.insert(adminUsers).values({
    email,
    password: hashedPassword,
    firstName: firstName || null,
    lastName: lastName || null,
    role: "admin",
  });
  
  console.log("✅ Admin added successfully!");
}

async function updateAdmin() {
  await listAdmins();
  
  const email = await question("\nEnter email of admin to update: ");
  
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (!admin) {
    console.log("❌ Admin not found!");
    return;
  }
  
  console.log("\nCurrent details:");
  console.log(`Email: ${admin.email}`);
  console.log(`Name: ${admin.firstName} ${admin.lastName}`);
  console.log(`Role: ${admin.role}`);
  
  console.log("\n📝 Update Admin (press Enter to keep current value)\n");
  
  const newEmail = await question(`New Email (${admin.email}): `);
  const newPassword = await question("New Password (leave empty to keep current): ");
  const newFirstName = await question(`First Name (${admin.firstName}): `);
  const newLastName = await question(`Last Name (${admin.lastName}): `);
  
  const updates: any = {
    updatedAt: new Date(),
  };
  
  if (newEmail && newEmail !== admin.email) {
    // Check if new email already exists
    const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, newEmail));
    if (existing) {
      console.log("❌ Another admin with this email already exists!");
      return;
    }
    updates.email = newEmail;
  }
  
  if (newPassword) {
    updates.password = await bcrypt.hash(newPassword, 10);
  }
  
  if (newFirstName) updates.firstName = newFirstName;
  if (newLastName) updates.lastName = newLastName;
  
  await db
    .update(adminUsers)
    .set(updates)
    .where(eq(adminUsers.email, email));
  
  console.log("✅ Admin updated successfully!");
}

async function deleteAdmin() {
  await listAdmins();
  
  const email = await question("\nEnter email of admin to delete: ");
  
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (!admin) {
    console.log("❌ Admin not found!");
    return;
  }
  
  const confirm = await question(`⚠️  Are you sure you want to delete ${admin.firstName} ${admin.lastName} (${email})? (yes/no): `);
  
  if (confirm.toLowerCase() !== "yes") {
    console.log("❌ Deletion cancelled.");
    return;
  }
  
  await db.delete(adminUsers).where(eq(adminUsers.email, email));
  console.log("✅ Admin deleted successfully!");
}

async function changePassword() {
  await listAdmins();
  
  const email = await question("\nEnter email of admin to change password: ");
  
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
  if (!admin) {
    console.log("❌ Admin not found!");
    return;
  }
  
  const newPassword = await question("New Password: ");
  const confirmPassword = await question("Confirm Password: ");
  
  if (newPassword !== confirmPassword) {
    console.log("❌ Passwords don't match!");
    return;
  }
  
  if (newPassword.length < 6) {
    console.log("❌ Password must be at least 6 characters!");
    return;
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await db
    .update(adminUsers)
    .set({ 
      password: hashedPassword,
      updatedAt: new Date() 
    })
    .where(eq(adminUsers.email, email));
  
  console.log("✅ Password changed successfully!");
}

async function main() {
  console.log("\n🔧 Admin Management Tool\n");
  console.log("1. List all admins");
  console.log("2. Add new admin");
  console.log("3. Update admin details");
  console.log("4. Change admin password");
  console.log("5. Delete admin");
  console.log("6. Exit");
  
  const choice = await question("\nChoose an option (1-6): ");
  
  switch (choice) {
    case "1":
      await listAdmins();
      break;
    case "2":
      await addAdmin();
      break;
    case "3":
      await updateAdmin();
      break;
    case "4":
      await changePassword();
      break;
    case "5":
      await deleteAdmin();
      break;
    case "6":
      console.log("👋 Goodbye!");
      rl.close();
      process.exit(0);
      return;
    default:
      console.log("❌ Invalid option!");
  }
  
  // Ask if user wants to continue
  const continueChoice = await question("\nPress Enter to continue or 'q' to quit: ");
  if (continueChoice.toLowerCase() === "q") {
    console.log("👋 Goodbye!");
    rl.close();
    process.exit(0);
  } else {
    await main();
  }
}

main().catch((error) => {
  console.error("Error:", error);
  rl.close();
  process.exit(1);
});
