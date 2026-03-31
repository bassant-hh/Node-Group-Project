// import * as bookService from '../services/book.service.js';
// import { catchAsync } from '../utils/catchAsync.js';


const get_books = catchAsync(async (req, res, next) => {
    
    const books = await bookService.getAllBooks(req.query);
    
    res.status(200).json({
        success: true,
        count: books.length,
        data: books
    });
});


 const get_book_by_id = catchAsync(async (req, res, next) => {
    const book = await bookService.getBookById(req.params.id);
    
    res.status(200).json({
        success: true,
        data: book
    });
});


const add_book = catchAsync(async (req, res, next) => {
    const newBook = await bookService.createBook(req.body);
    
    res.status(201).json({
        success: true,
        message: "the book has been added successfully",
        data: newBook
    });
});

const update_book = catchAsync(async (req, res, next) => {
    const updatedBook = await bookService.updateBook(req.params.id, req.body);
    
    res.status(200).json({
        success: true,
        message: "The book data has been successfully updated",
        data: updatedBook
    });
});

const delete_book = catchAsync(async (req, res, next) => {
    await bookService.deleteBook(req.params.id);
    
    res.status(200).json({
        success: true,
        message: "The book has been permanently deleted from the system."
    });
});


const delete_books = catchAsync(async (req, res, next) => {
    const result = await bookService.deleteMultipleBooks(req.body.ids);
    
    res.status(200).json({
        success: true,
        message: `${result.deletedCount} was successfully deleted`
    });
});


export {
    get_books,
    get_book_by_id,
    update_book,
    add_book,
    delete_book,
    delete_books 
}