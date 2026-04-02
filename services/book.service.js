
import Book from '../models/Book.js';

export const createBook = async (bookData) => {
    if (bookData.series && bookData.series.seriesName) {
        bookData.series.seriesSlug = bookData.series.seriesName
            .toLowerCase()
            .trim()

            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }


    const book = await Book.create(bookData);
    return book;
};


export const getAllBooks = async (filters) => {
    const query = {};

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.seriesSlug) {
        query['series.seriesSlug'] = filters.seriesSlug;
    }

    return await Book.find(query).sort({ createdAt: -1 });
};

export const getBookById = async (id) => {
    const book = await Book.findById(id);
    if (!book) {
        const error = new Error('Sorry, the book you are looking for does not exist');
        error.statusCode = 404;
        throw error;
    }
    return book;
};


export const updateBook = async (id, updateData) => {

    if (updateData.series && updateData.series.seriesName) {

        updateData.series.seriesSlug = updateData.series.seriesName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

    }

    const updatedBook = await Book.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedBook) {
        const error = new Error('Failed to update the book, it does not exist');
        error.statusCode = 404;
        throw error;
    }

    return updatedBook;
};


export const deleteBook = async (id) => {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
        const error = new Error('Failed to delete the book, it does not exist');
        error.statusCode = 404;
        throw error;
    }
    return book;
};


export const deleteMultipleBooks = async (ids) => {
    if (!ids || !Array.isArray(ids)) {
        const error = new Error('Failed to delete books, invalid IDs provided');
        error.statusCode = 400;
        throw error;
    }
    return await Book.deleteMany({ _id: { $in: ids } });

};