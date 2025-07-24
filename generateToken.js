const { StreamChat } = require('stream-chat');

// 1. Paste your credentials from your DEVELOPMENT app here
const apiKey = 'yw2nup36tnpk';
const apiSecret = '2bd4nme6p7xaug3ercba268pq2wm5ak5qkwfpsftvvsd5bj8yvn64cvpkjudcfc3';

// 2. Define the User ID you want a token for
const userId = 'cristal-final-user';

// Initialize the Stream client
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Create the token
const token = serverClient.createToken(userId);

// Print the token to your terminal
console.log('Your new user token is:');
console.log(token);