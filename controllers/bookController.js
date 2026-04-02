import {
    createBook,
    deleteBook, deleteMultipleBooks,
    getAllBooks, getBookById,
    updateBook
} from '../services/book.service.js';

export const get_books = async (req, res, next) => {

    const books = await getAllBooks(req.query);

    res.status(200).json({
        success: true,
        count: books.length,
        data: books
    });
};


export const get_book_by_id = async (req, res, next) => {
    const book = await getBookById(req.params.id);

    res.status(200).json({
        success: true,
        data: book
    });
};


export const add_book = async (req, res, next) => {
    const newBook = await createBook(req.body);

    res.status(201).json({
        success: true,
        message: "the book has been added successfully",
        data: newBook
    });
};

export const update_book = async (req, res, next) => {
    const updatedBook = await updateBook(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "The book data has been successfully updated",
        data: updatedBook
    });
};

export const delete_book = async (req, res, next) => {
    await deleteBook(req.params.id);

    res.status(200).json({
        success: true,
        message: "The book has been permanently deleted from the system."
    });
};


export const delete_books = async (req, res, next) => {
    const result = await deleteMultipleBooks(req.body.ids);

    res.status(200).json({
        success: true,
        message: `${result.deletedCount} was successfully deleted`
    });
};