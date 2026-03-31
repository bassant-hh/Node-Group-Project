import Book from '../models/book.model.js';

export const createBook = async (bookData) => {
    if (bookData.series && bookData.series.seriesName) {
        bookData.series.seriesSlug = bookData.series.seriesName
            .toLowerCase()
            .replace(/ /g, '-'); 
    }

    const book = await Book.create(bookData);
    return book;
};

export const getAllBooks = async (filters) => {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.seriesSlug) query['series.seriesSlug'] = filters.seriesSlug;

    return await Book.find(query);
};