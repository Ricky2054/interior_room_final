#!/usr/bin/env node

/**
 * This script provides instructions to fix Google OAuth configuration.
 */

const { execSync } = require('child_process');

// Get the Vercel project URL
let projectUrl = '';
try {
  const vercelInfo = execSync('vercel project ls --json').toString();
  const projects = JSON.parse(vercelInfo);
  const currentProject = projects.find(p => p.name === 'interior-room-final');
  if (currentProject) {
    projectUrl = currentProject.url;
  }
} catch (error) {
  console.log('Could not automatically determine project URL.');
}

console.log('🔧 Google OAuth Configuration Fixer\n');

console.log('The error you\'re seeing is likely due to incorrect Google OAuth configuration.');
console.log('Follow these steps to fix it:\n');

console.log('1. Go to the Google Cloud Console:');
console.log('   https://console.cloud.google.com/apis/credentials\n');

console.log('2. Find and edit your OAuth 2.0 Client ID\n');

console.log('3. Update the Authorized JavaScript origins:');
if (projectUrl) {
  console.log(`   https://${projectUrl}`);
} else {
  console.log('   https://interior-room-final-cnelqkzrw-ricky2054s-projects.vercel.app');
  console.log('   (Replace with your actual Vercel deployment URL)');
}
console.log('\n');

console.log('4. Update the Authorized redirect URIs:');
if (projectUrl) {
  console.log(`   https://${projectUrl}/api/auth/callback/google`);
} else {
  console.log('   https://interior-room-final-cnelqkzrw-ricky2054s-projects.vercel.app/api/auth/callback/google');
  console.log('   (Replace with your actual Vercel deployment URL)');
}
console.log('\n');

console.log('5. Click "Save"\n');

console.log('6. Update your Vercel environment variables:');
console.log('   vercel env rm NEXTAUTH_URL');
console.log('   vercel env add NEXTAUTH_URL production');
if (projectUrl) {
  console.log(`   Value: https://${projectUrl}`);
} else {
  console.log('   Value: https://interior-room-final-cnelqkzrw-ricky2054s-projects.vercel.app');
  console.log('   (Replace with your actual Vercel deployment URL)');
}
console.log('\n');

console.log('7. Redeploy your application:');
console.log('   vercel --prod\n');

console.log('8. Clear your browser cookies and try signing in again.\n');

console.log('If you\'re still having issues, check the error page for more information.'); 