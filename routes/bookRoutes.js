import express from 'express';
import { add_book, delete_book, delete_books, get_book_by_id, get_books, update_book } from '../controllers/bookController.js';
import { isLogin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', get_books);
router.get('/:id', get_book_by_id);
router.post('/', add_book);
router.patch('/:id', update_book);
router.delete('/:id', delete_book);
router.delete('/', delete_books);

export default router;