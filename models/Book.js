import mongoose from 'mongoose';



const bookSchema = new mongoose.Schema({
    bookName: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    descriptionAuthor: { type: String },
    category: { type: String, required: true },
    language: { type: String, default: 'Arabic' },
    description: { type: String },

    pages: { type: Number, default: 0, required: true, },


    series: {
        seriesName: { type: String, trim: true },
        seriesSlug: { type: String, index: true, lowercase: true, trim: true },
        partNumber: { type: Number, default: 1 },
        totalPartsInSeries: { type: Number, default: 1 },
    },



    cover: { type: String, default: 'default-cover.jpg' },


    price: {
        rent: {
            type: Number,
            required: [true],
            min: [0]
        },
        buy: {
            type: Number,
            required: [true],
            min: [0]
        }
    },
    stock: { type: Number, default: 1 },

    note: { type: String },
    quote: { type: String },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        fullName: String,
        comment: String,
        rating: { type: Number, min: 1, max: 5 }
    }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);
