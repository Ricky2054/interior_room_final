// Simple script to verify OAuth configuration
// Run with: node verify-oauth-config.js

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

console.log('🔍 Verifying OAuth Configuration...');

// Check if .env.local exists
try {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ .env.local file exists');
  
  // Check for required environment variables
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  } else {
    console.log('✅ All required environment variables are present');
  }
  
  // Check NEXTAUTH_URL
  const nextAuthUrlMatch = envContent.match(/NEXTAUTH_URL=['"]([^'"]+)['"]/);
  if (nextAuthUrlMatch) {
    const nextAuthUrl = nextAuthUrlMatch[1];
    console.log(`📌 NEXTAUTH_URL is set to: ${nextAuthUrl}`);
    
    // Parse the URL to get the port
    const parsedUrl = url.parse(nextAuthUrl);
    const port = parsedUrl.port;
    
    if (port) {
      console.log(`📌 Your application is configured to use port: ${port}`);
      
      // Check if the port matches what's in package.json
      try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        const devScript = packageJson.scripts.dev;
        const portMatch = devScript.match(/-p\s+(\d+)/);
        
        if (portMatch) {
          const configuredPort = portMatch[1];
          if (configuredPort === port) {
            console.log(`✅ Port in package.json (${configuredPort}) matches NEXTAUTH_URL port (${port})`);
          } else {
            console.error(`❌ Port mismatch! package.json uses port ${configuredPort} but NEXTAUTH_URL uses port ${port}`);
          }
        }
      } catch (err) {
        console.error('❌ Error reading package.json:', err.message);
      }
      
      // Check if the port is actually in use
      const server = http.createServer();
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`✅ Port ${port} is in use (likely by your Next.js app)`);
        } else {
          console.error(`❌ Error checking port ${port}:`, err.message);
        }
        checkComplete();
      });
      
      server.on('listening', () => {
        console.error(`❌ Port ${port} is not in use! Your application might not be running.`);
        server.close();
        checkComplete();
      });
      
      try {
        server.listen(port);
      } catch (err) {
        console.error(`❌ Error checking port ${port}:`, err.message);
        checkComplete();
      }
    } else {
      checkComplete();
    }
  } else {
    checkComplete();
  }
  
} catch (err) {
  console.error('❌ Error reading configuration files:', err.message);
  checkComplete();
}

function checkComplete() {
  console.log('\n📋 Next steps:');
  console.log('1. Make sure your application is running on the correct port');
  console.log('2. Update your Google Cloud Console with the correct redirect URIs');
  console.log('3. Follow the instructions in GOOGLE_OAUTH_FIX.md');
  process.exit(0); 