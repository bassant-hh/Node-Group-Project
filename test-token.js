import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Check if secret is loaded
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? '✅ Yes' : '❌ No');
console.log('JWT_SECRET value:', process.env.JWT_SECRET);

// Create a test user payload (use an actual user ID from your database)
const testPayload = {
    id: "69cdeadc8fcb2820baf4c941",  // Replace with a REAL user ID from your DB
    username: "MohamedYasser",
    role: "USER"
};

// Generate new token
const newToken = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '7d' });

console.log('\n NEW TOKEN:\n', newToken);
console.log('\n Use this token in Postman/Insomnia:');
console.log(`Authorization: Bearer ${newToken}`);

// Verify the token works
try {
    const verified = jwt.verify(newToken, process.env.JWT_SECRET);
    console.log('\n Token verification successful!');
    console.log('Decoded payload:', verified);
} catch (error) {
    console.log('\n Token verification failed:', error.message);
}