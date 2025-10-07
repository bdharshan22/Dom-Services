import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');
console.log('EMAIL_PASS value:', process.env.EMAIL_PASS);