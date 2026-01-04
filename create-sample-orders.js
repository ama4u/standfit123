import postgres from 'postgres';

async function createSampleOrders() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found');
    process.exit(1);
  }

  console.log('🐘 Connecting to PostgreSQL...');
  
  const sql = postgres(databaseUrl, {
    ssl: { rejectUnauthorized: false },
    max: 1,
  });

  try {
    console.log('📊 Creating sample orders for analytics...');
    
    // Get some products to use in orders
    const products = await sql`SELECT id, name, price FROM products LIMIT 5`;
    console.log(`Found ${products.length} products to use in sample orders`);
    
    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      return;
    }
    
    // Create sample orders
    const sampleOrders = [
      {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+234 801 234 5678',
        shippingAddress: '123 Lagos Street, Victoria Island, Lagos',
        totalAmount: 15000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        notes: 'Sample order for testing analytics'
      },
      {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+234 802 345 6789',
        shippingAddress: '456 Abuja Road, Garki, Abuja',
        totalAmount: 8500,
        status: 'processing',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        notes: 'Rush delivery requested'
      },
      {
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        customerPhone: '+234 803 456 7890',
        shippingAddress: '789 Port Harcourt Avenue, GRA, Port Harcourt',
        totalAmount: 22000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        notes: 'Bulk order for restaurant'
      },
      {
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@example.com',
        customerPhone: '+234 804 567 8901',
        shippingAddress: '321 Kano Street, Sabon Gari, Kano',
        totalAmount: 5200,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
        notes: 'First time customer'
      },
      {
        customerName: 'David Brown',
        customerEmail: 'david@example.com',
        customerPhone: '+234 805 678 9012',
        shippingAddress: '654 Ibadan Road, Bodija, Ibadan',
        totalAmount: 18700,
        status: 'completed',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'paid',
        notes: 'Regular customer - monthly order'
      }
    ];
    
    console.log('📝 Creating orders...');
    
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = sampleOrders[i];
      
      // Create the order
      const [order] = await sql`
        INSERT INTO orders (
          customer_name, customer_email, customer_phone, shipping_address,
          total_amount, status, payment_method, payment_status, notes
        )
        VALUES (
          ${orderData.customerName}, ${orderData.customerEmail}, ${orderData.customerPhone},
          ${orderData.shippingAddress}, ${orderData.totalAmount}, ${orderData.status},
          ${orderData.paymentMethod}, ${orderData.paymentStatus}, ${orderData.notes}
        )
        RETURNING id
      `;
      
      // Add some order items
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      let orderTotal = 0;
      
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const priceAtOrder = product.price;
        
        await sql`
          INSERT INTO order_items (order_id, product_id, quantity, price_at_order)
          VALUES (${order.id}, ${product.id}, ${quantity}, ${priceAtOrder})
        `;
        
        orderTotal += priceAtOrder * quantity;
      }
      
      // Update order total to match items
      await sql`
        UPDATE orders 
        SET total_amount = ${orderTotal}
        WHERE id = ${order.id}
      `;
      
      console.log(`✅ Created order ${i + 1}: ${orderData.customerName} - ₦${orderTotal.toLocaleString()}`);
    }
    
    // Check final analytics
    console.log('');
    console.log('📊 Updated Analytics:');
    
    const totalOrders = await sql`SELECT COUNT(*) as count FROM orders`;
    const totalSales = await sql`SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'`;
    const totalProducts = await sql`SELECT COUNT(*) as count FROM products`;
    const totalUsers = await sql`SELECT COUNT(*) as count FROM users`;
    
    console.log(`   - Total Orders: ${totalOrders[0].count}`);
    console.log(`   - Total Sales: ₦${(totalSales[0].total || 0).toLocaleString()}`);
    console.log(`   - Total Products: ${totalProducts[0].count}`);
    console.log(`   - Total Users: ${totalUsers[0].count}`);
    
    console.log('');
    console.log('🎉 Sample orders created successfully!');
    console.log('📈 Admin dashboard should now show analytics data');
    console.log('');
    console.log('🔗 Check the admin dashboard:');
    console.log('   https://standfit-e816d09b795a.herokuapp.com/admin-login');
    console.log('   Login: standfit2025@standfit.com / Standfit@1447');
    
  } catch (error) {
    console.error('❌ Failed to create sample orders:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

createSampleOrders();