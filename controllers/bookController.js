import {
    createBook,
    deleteBook, deleteMultipleBooks,
    getAllBooks, getBookById,
    updateBook
} from '../services/book.service.js';

import { responseObj } from './../utils.js';

export const get_books = async (req, res, next) => {
    
    const books = await getAllBooks(req.query,req.sort,req.sortby,req.page);

    res.status(200).json(responseObj(200,"Books Retrived Successfully",{
        success: true,
        count: books.length,
        data: books
    }));
};


export const get_book_by_id = async (req, res, next) => {
    const book = await getBookById(req.params.id);

    res.status(200).json(responseObj(200,"Book Retrived Successfully",{
        success: true,
        data: book
    }));
};


export const add_book = async (req, res, next) => {
    const newBook = await createBook(req.body);

    res.status(201).json(responseObj(201,"Book Added Successfully",{
        success: true,
        data: newBook
    }));
};

export const update_book = async (req, res, next) => {
    const updatedBook = await updateBook(req.params.id, req.body);

    res.status(200).json(responseObj(200,"The book data has been successfully updated",{
        success: true,
        data: updatedBook
    }));
};

export const delete_book = async (req, res, next) => {
    await deleteBook(req.params.id);

    res.status(200).json(response(200,"The book has been permanently deleted from the system.",{
        success: true
    }));
};


export const delete_books = async (req, res, next) => {
    const result = await deleteMultipleBooks(req.body.ids);

    res.status(200).json(responseObj(200,`${result.deletedCount} was successfully deleted`,{
        success: true
    }));
};