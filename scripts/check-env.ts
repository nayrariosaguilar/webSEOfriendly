import dotenv from 'dotenv';
const config = dotenv.config({ path: '.env.local' });
if (config.parsed) {
  console.log('Keys in .env.local:', Object.keys(config.parsed));
} else {
  console.log('Could not parse .env.local or it does not exist.');
}
