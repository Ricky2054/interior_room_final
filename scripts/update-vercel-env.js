#!/usr/bin/env node

/**
 * This script helps update environment variables on Vercel.
 * It provides guidance on how to update environment variables using the Vercel CLI.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to check if Vercel CLI is installed
function isVercelCliInstalled() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to check if user is logged in to Vercel
function isLoggedInToVercel() {
  try {
    const result = execSync('vercel whoami', { stdio: 'pipe' }).toString().trim();
    return !result.includes('Error');
  } catch (error) {
    return false;
  }
}

// Function to get project name from package.json
function getProjectName() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    return packageJson.name || null;
  } catch (error) {
    return null;
  }
}

// Main function
async function main() {
  console.log('🔧 Vercel Environment Variables Update Tool\n');
  
  // Check if Vercel CLI is installed
  if (!isVercelCliInstalled()) {
    console.log('❌ Vercel CLI is not installed. Please install it first:');
    console.log('npm install -g vercel');
    rl.close();
    return;
  }
  
  // Check if user is logged in to Vercel
  if (!isLoggedInToVercel()) {
    console.log('❌ You are not logged in to Vercel. Please log in first:');
    console.log('vercel login');
    rl.close();
    return;
  }
  
  console.log('✅ Vercel CLI is installed and you are logged in.\n');
  
  // Get project name
  const projectName = getProjectName();
  console.log(`📂 Project: ${projectName || 'Unknown'}\n`);
  
  // Ask for environment variable to update
  rl.question('Enter the name of the environment variable to update: ', (envName) => {
    if (!envName) {
      console.log('❌ No environment variable name provided. Exiting...');
      rl.close();
      return;
    }
    
    rl.question(`Enter the new value for ${envName}: `, (envValue) => {
      if (!envValue) {
        console.log('❌ No value provided. Exiting...');
        rl.close();
        return;
      }
      
      console.log(`\n📋 To update ${envName} on Vercel, run the following command:`);
      console.log(`vercel env rm ${envName} production -y && vercel env add ${envName} production`);
      console.log('\nWhen prompted, enter the following value:');
      console.log(envValue);
      
      console.log('\n💡 After updating the environment variable, you need to redeploy your project:');
      console.log('vercel --prod');
      
      rl.close();
    });
  });
}

main(); 