import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Book from './models/Book.js';

dotenv.config();

const sampleBooks = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 25.99,
        rentalPrice: 5.99,
        stock: 10,
        description: "A classic novel set in the Jazz Age",
        category: "Fiction",
        coverImage: "https://example.com/gatsby.jpg"
    },
    {
        title: "1984",
        author: "George Orwell",
        price: 22.99,
        rentalPrice: 4.99,
        stock: 15,
        description: "Dystopian social science fiction",
        category: "Science Fiction",
        coverImage: "https://example.com/1984.jpg"
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 24.99,
        rentalPrice: 5.99,
        stock: 8,
        description: "A novel about racial injustice",
        category: "Fiction",
        coverImage: "https://example.com/mockingbird.jpg"
    }
];

const seedBooks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_ATLAS_URI);
        
        
        await Book.deleteMany({});
        console.log('Deleted existing books');
        

        const inserted = await Book.insertMany(sampleBooks);
        
        console.log(`\n Added ${inserted.length} books:\n`);
        inserted.forEach(book => {
            console.log(`ID: ${book._id}`);
            console.log(`Title: ${book.title}`);
            console.log(`Price: $${book.price}`);
            console.log('---');
        });
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

seedBooks();