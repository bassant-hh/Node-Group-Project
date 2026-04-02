import express from 'express';

import { add_book, delete_book, delete_books, get_book_by_id, get_books, update_book } from '../controllers/bookController.js';

import { haveAccess,isLogin,isAdmin } from './../middleware/authMiddleware.js';
import { sort,sortBy,pagination,search } from './../middleware/collectionMiddleware.js';
import { errorMiddleware } from './../middleware/errorMiddleware.js';

const router = express.Router();

router.get('/', errorMiddleware,search,pagination,sort,sortBy(['title','createdAt','pages','price']),errorMiddleware,get_books);
router.get('/:id', errorMiddleware,isLogin,haveAccess,get_book_by_id,errorMiddleware);
router.post('/', errorMiddleware,isLogin,isAdmin,add_book,errorMiddleware);
router.patch('/:id', errorMiddleware,isLogin,isAdmin,update_book,errorMiddleware);
router.delete('/:id', errorMiddleware,isLogin,isAdmin,delete_book,errorMiddleware);
router.delete('/', errorMiddleware,isLogin,isAdmin,delete_books,errorMiddleware);

export default router;