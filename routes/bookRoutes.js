import express from 'express';

import { add_book, delete_book, delete_books, get_book_by_id, get_books, update_book } from '../controllers/bookController.js';

import { haveAccess,isLogin,isAdmin } from './../middleware/authMiddleware.js';
import { sort,sortBy,pagination,search } from './../middleware/collectionMiddleware.js';
import { errorMiddleware } from './../middleware/errorMiddleware.js';

const router = express.Router();

router.get('/', search,pagination,sort,sortBy(['title','createdAt','pages','price']),get_books);
router.get('/:id', isLogin,haveAccess,get_book_by_id);
router.post('/', isLogin,isAdmin,add_book);
router.put('/:id', isLogin,isAdmin,update_book);
router.delete('/:id', isLogin,isAdmin,delete_book);

export default router;