#!/usr/bin/env node

/**
 * This script verifies a Vercel deployment by checking key endpoints
 * and functionality. It helps ensure that your deployment is working correctly.
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to make an HTTP request
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Function to check if a URL is accessible
async function checkEndpoint(url, name) {
  try {
    console.log(`🔍 Checking ${name}...`);
    const response = await makeRequest(url);
    
    if (response.statusCode >= 200 && response.statusCode < 400) {
      console.log(`✅ ${name} is accessible (Status: ${response.statusCode})`);
      return true;
    } else {
      console.log(`❌ ${name} returned status code ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error checking ${name}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Vercel Deployment Verification Tool\n');
  
  // Get the deployment URL
  rl.question('Enter your Vercel deployment URL (e.g., https://your-app.vercel.app): ', async (deploymentUrl) => {
    if (!deploymentUrl) {
      console.log('❌ No URL provided. Exiting...');
      rl.close();
      return;
    }
    
    // Remove trailing slash if present
    deploymentUrl = deploymentUrl.replace(/\/$/, '');
    
    console.log(`\n🔍 Verifying deployment at ${deploymentUrl}...\n`);
    
    // Check main page
    const mainPageOk = await checkEndpoint(deploymentUrl, 'Main page');
    
    // Check API endpoints
    const apiEndpoints = [
      { url: `${deploymentUrl}/api/auth/providers`, name: 'Auth providers endpoint' },
      { url: `${deploymentUrl}/api/validate-api-key`, name: 'API key validation endpoint' }
    ];
    
    let apiEndpointsOk = true;
    for (const endpoint of apiEndpoints) {
      const ok = await checkEndpoint(endpoint.url, endpoint.name);
      apiEndpointsOk = apiEndpointsOk && ok;
    }
    
    console.log('\n📋 Verification Summary:');
    console.log(`Main page: ${mainPageOk ? '✅ OK' : '❌ Failed'}`);
    console.log(`API endpoints: ${apiEndpointsOk ? '✅ OK' : '❌ Some failed'}`);
    
    console.log('\n🔍 Next steps for manual verification:');
    console.log('1. Try signing in with Google');
    console.log('2. Test generating an image from text');
    console.log('3. Test transforming an existing image');
    
    rl.close();
  });
}

main(); 