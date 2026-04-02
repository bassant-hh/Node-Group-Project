import {
    createBook,
    deleteBook,
    deleteMultipleBooks,
    getAllBooks,
    getBookById,
    updateBook
} from '../services/book.service.js';


export const get_books = async (req, res, next) => {
    try {

        const books = await getAllBooks(req.query);

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });

    } catch (error) {
        next(error);
    }
};


export const get_book_by_id = async (req, res, next) => {
    try {

        const book = await getBookById(req.params.id);

        res.status(200).json({
            success: true,
            data: book
        });

    } catch (error) {
        next(error);
    }
};


export const add_book = async (req, res, next) => {
    try {

        const newBook = await createBook(req.body);

        res.status(201).json({
            success: true,
            message: "The book has been added successfully",
            data: newBook
        });

    } catch (error) {
        next(error);
    }
};


export const update_book = async (req, res, next) => {
    try {

        const updatedBook = await updateBook(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "The book data has been successfully updated",
            data: updatedBook
        });

    } catch (error) {
        next(error);
    }
};


export const delete_book = async (req, res, next) => {
    try {

        await deleteBook(req.params.id);

        res.status(200).json({
            success: true,
            message: "The book has been permanently deleted from the system"
        });

    } catch (error) {
        next(error);
    }
};


export const delete_books = async (req, res, next) => {
    try {

        const result = await deleteMultipleBooks(req.body.ids);

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} books were successfully deleted`
        });

    } catch (error) {
        next(error);
    }
};