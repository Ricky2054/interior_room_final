// Simple script to check OAuth configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking OAuth Configuration...');

// Check .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file exists');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    // Extract NEXTAUTH_URL
    const nextAuthUrlLine = lines.find(line => line.startsWith('NEXTAUTH_URL='));
    if (nextAuthUrlLine) {
      const url = nextAuthUrlLine.split('=')[1].replace(/['"]/g, '');
      console.log(`📌 NEXTAUTH_URL is set to: ${url}`);
      
      // Extract port from URL
      const portMatch = url.match(/:(\d+)/);
      if (portMatch) {
        const port = portMatch[1];
        console.log(`📌 Port in NEXTAUTH_URL: ${port}`);
      }
    } else {
      console.error('❌ NEXTAUTH_URL not found in .env.local');
    }
    
    // Check Google credentials
    const googleIdLine = lines.find(line => line.startsWith('GOOGLE_CLIENT_ID='));
    const googleSecretLine = lines.find(line => line.startsWith('GOOGLE_CLIENT_SECRET='));
    
    if (googleIdLine) {
      console.log('✅ GOOGLE_CLIENT_ID is set');
    } else {
      console.error('❌ GOOGLE_CLIENT_ID not found in .env.local');
    }
    
    if (googleSecretLine) {
      console.log('✅ GOOGLE_CLIENT_SECRET is set');
    } else {
      console.error('❌ GOOGLE_CLIENT_SECRET not found in .env.local');
    }
  } else {
    console.error('❌ .env.local file not found');
  }
  
  // Check package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    console.log('✅ package.json file exists');
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const devScript = packageJson.scripts.dev;
    
    if (devScript) {
      console.log(`📌 dev script: ${devScript}`);
      
      const portMatch = devScript.match(/-p\s+(\d+)/);
      if (portMatch) {
        const port = portMatch[1];
        console.log(`📌 Port in package.json: ${port}`);
      }
    }
  } else {
    console.error('❌ package.json file not found');
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Make sure your application is running on port 3002');
  console.log('2. Update Google Cloud Console with the correct redirect URI:');
  console.log('   http://localhost:3002/api/auth/callback/google');
  console.log('3. Follow the instructions in GOOGLE_OAUTH_FIX.md');
  
} catch (error) {
  console.error('Error:', error.message);
} 