#!/usr/bin/env node

const { exec } = require('child_process');
const net = require('net');

// Function to check if port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(false));
      server.close();
    });
    server.on('error', () => resolve(true));
  });
}

// Function to kill processes on port
function killPort(port) {
  return new Promise((resolve) => {
    // Windows command to find and kill processes on port
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (error || !stdout) {
        resolve();
        return;
      }
      
      const lines = stdout.split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].includes(`:${port}`)) {
          pids.add(parts[4]);
        }
      });
      
      if (pids.size === 0) {
        resolve();
        return;
      }
      
      const killCommands = Array.from(pids).map(pid => 
        `taskkill /F /PID ${pid} 2>nul`
      ).join(' & ');
      
      exec(killCommands, () => {
        console.log(`✅ Killed processes on port ${port}`);
        resolve();
      });
    });
  });
}

async function main() {
  const port = 5000;
  
  console.log(`🔍 Checking port ${port}...`);
  
  const inUse = await checkPort(port);
  
  if (inUse) {
    console.log(`⚠️  Port ${port} is in use. Killing processes...`);
    await killPort(port);
    
    // Wait a moment and check again
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const stillInUse = await checkPort(port);
    if (stillInUse) {
      console.log(`❌ Could not free port ${port}. Please manually stop processes.`);
      process.exit(1);
    }
  }
  
  console.log(`✅ Port ${port} is now available!`);
  console.log(`🚀 You can now run: npm run dev`);
}

main().catch(console.error);