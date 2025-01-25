const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the admin password: ', (password) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error generating hash:', err);
    } else {
      console.log('Add the following to your .env file:');
      console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    }
    rl.close();
  });
});

