import express from 'express';
const router = express.Router();
import books from '../controllers/bookController.js';

router.get('/', books.get_books);
router.get('/:id', books.get_book_by_id);
router.post('/', books.add_book);
router.patch('/:id', books.update_book);
router.delete('/:id', books.delete_book);
router.delete('/', books.delete_books);

export default router;