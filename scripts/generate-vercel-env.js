#!/usr/bin/env node

/**
 * This script generates a Vercel CLI command to set environment variables
 * from your local .env files. This makes it easier to transfer your
 * environment variables to Vercel.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Function to parse .env file
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) return;
    
    // Match KEY=VALUE pattern, handling quotes
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      
      env[key] = value;
    }
  });
  
  return env;
}

// Main function
function main() {
  console.log('🔧 Generating Vercel environment variables command...\n');
  
  // Parse .env files
  const envLocal = parseEnvFile(path.join(process.cwd(), '.env.local'));
  const envProd = parseEnvFile(path.join(process.cwd(), '.env.production'));
  
  // Combine environment variables, with production taking precedence
  const env = { ...envLocal, ...envProd };
  
  // Generate NEXTAUTH_SECRET if not present
  if (!env.NEXTAUTH_SECRET) {
    env.NEXTAUTH_SECRET = crypto.randomBytes(32).toString('hex');
    console.log('⚠️ NEXTAUTH_SECRET not found, generated a new one.');
  }
  
  // Build vercel env add commands
  const commands = [];
  
  for (const [key, value] of Object.entries(env)) {
    // Skip empty values
    if (!value) continue;
    
    // Add command for each environment variable
    commands.push(`vercel env add ${key} production`);
  }
  
  if (commands.length === 0) {
    console.log('❌ No environment variables found in .env.local or .env.production');
    return;
  }
  
  console.log('📋 Run these commands to add your environment variables to Vercel:');
  console.log('\n# Make sure you have the Vercel CLI installed and are logged in');
  console.log('# npm i -g vercel && vercel login\n');
  console.log('# Link your project to Vercel if not already linked');
  console.log('# vercel link\n');
  console.log('# Add environment variables');
  commands.forEach(cmd => console.log(cmd));
  
  console.log('\n💡 For each command, you will be prompted to enter the value.');
  console.log('   Here are the values you should enter:');
  
  for (const [key, value] of Object.entries(env)) {
    if (!value) continue;
    console.log(`   ${key}: ${value}`);
  }
  
  console.log('\n🎉 After adding all environment variables, deploy your project:');
  console.log('vercel --prod');
}

main(); 