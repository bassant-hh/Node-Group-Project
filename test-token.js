import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured in .env');
    process.exit(1);
}

const testPayload = {
    id: '000000000000000000000000',
    username: 'test-user',
    role: 'USER'
};

const newToken = jwt.sign(testPayload, process.env.JWT_SECRET, {
    expiresIn: '7d'
});

console.log('\nNEW TOKEN:\n', newToken);
console.log('\nUse this token in Postman/Insomnia:');
console.log(`Authorization: Bearer ${newToken}`);

try {
    const verified = jwt.verify(newToken, process.env.JWT_SECRET);
    console.log('\nToken verification successful!');
    console.log('Decoded payload:', verified);
} catch (error) {
    console.error('\nToken verification failed:', error.message);
    process.exit(1);
}
