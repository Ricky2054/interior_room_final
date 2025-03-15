#!/usr/bin/env node

/**
 * This script checks if the application is ready for deployment to Vercel.
 * It verifies the presence of required files and environment variables.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking deployment readiness...\n');

// Check for required files
const requiredFiles = [
  '.env.production',
  '.vercelignore',
  'next.config.js',
  'package.json',
  'lib/stability-api.ts',
  'lib/auth.ts',
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/validate-api-key/route.ts',
  'app/api/generate/route.ts',
  'app/api/transform/route.ts'
];

let missingFiles = [];
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log('❌ Missing required files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('✅ All required files are present');
}

// Check for required environment variables in .env.production
let envErrors = [];
try {
  const envFile = fs.readFileSync(path.join(process.cwd(), '.env.production'), 'utf8');
  const requiredEnvVars = [
    'STABILITY_API_KEY',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (!envFile.includes(`${envVar}=`)) {
      envErrors.push(`Missing ${envVar} in .env.production`);
    } else if (envFile.includes(`${envVar}=\n`) || envFile.includes(`${envVar}=""\n`) || envFile.includes(`${envVar}=''\n`)) {
      envErrors.push(`${envVar} is empty in .env.production`);
    }
  });
} catch (error) {
  envErrors.push('Could not read .env.production file');
}

if (envErrors.length > 0) {
  console.log('\n❌ Environment variable issues:');
  envErrors.forEach(error => console.log(`   - ${error}`));
} else {
  console.log('\n✅ All required environment variables are set');
}

// Check for Next.js build errors
console.log('\n🔍 Checking for build errors...');
try {
  // Run next build with --no-lint to just check for TypeScript errors
  execSync('npx next build --no-lint', { stdio: 'pipe' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('❌ Build failed. Fix the errors before deploying.');
  console.log('   Run "npm run build" to see detailed errors.');
}

// Final assessment
if (missingFiles.length === 0 && envErrors.length === 0) {
  console.log('\n🎉 Your application is ready for deployment to Vercel!');
  console.log('   Run "npm run prepare-vercel" to prepare for deployment.');
  console.log('   Then follow the instructions in VERCEL_DEPLOYMENT.md');
} else {
  console.log('\n⚠️ Your application is not ready for deployment yet.');
  console.log('   Fix the issues above before deploying to Vercel.');
} 