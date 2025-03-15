// This script helps prepare the project for Vercel deployment
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Preparing project for Vercel deployment...');

// Generate a random NEXTAUTH_SECRET if not already set
if (!process.env.NEXTAUTH_SECRET) {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log(`✅ Generated NEXTAUTH_SECRET: ${secret}`);
  console.log('   Make sure to add this to your Vercel environment variables!');
}

// Check for required environment variables
const requiredVars = [
  'STABILITY_API_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('   Make sure to add these to your Vercel environment variables!');
} else {
  console.log('✅ All required environment variables are set');
}

// Create a .vercelignore file
const vercelIgnorePath = path.join(process.cwd(), '.vercelignore');
const vercelIgnoreContent = `
# Python files (no longer needed)
*.py
requirements.txt
myenv/
__pycache__/

# Development files
.env.local
.env.development.local
.env.test.local
.env.production.local
.vscode/
.idea/

# Debug files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Test files
/test/
/tests/
/coverage/

# Misc
.DS_Store
*.pem
`;

fs.writeFileSync(vercelIgnorePath, vercelIgnoreContent.trim());
console.log('✅ Created .vercelignore file');

console.log('\n🎉 Project is ready for Vercel deployment!');
console.log('\nNext steps:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your repository to Vercel');
console.log('3. Set the required environment variables in the Vercel dashboard');
console.log('4. Deploy your project'); 