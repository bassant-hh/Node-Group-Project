import Order from '../models/Order.js';
import Book from '../models/Book.js';

// Helper: Update book stock
const updateBookStock = async (books, operation) => {
    for (const item of books) {
        const book = await Book.findById(item.bookId);
        if (!book) throw new Error(`Book ${item.bookId} not found`);
        
        if (operation === 'decrease') {
            if (book.availableCopies < item.quantity) {
                throw new Error(`Insufficient copies for ${book.title}`);
            }
            book.availableCopies -= item.quantity;
        } else {
            book.availableCopies += item.quantity;
        }
        await book.save();
    }
};

// @desc    Get all orders (admin: all, user: their own)
// @route   GET /api/orders
// @access  Private
export const get_orders = async (req, res) => {
    try {
        const filter = req.user.role !== 'admin' ? { userId: req.user.id } : {};
        
        const orders = await Order.find(filter)
            .populate('userId', 'name email')
            .populate('books.bookId', 'title author price');
        
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const get_order_by_id = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('books.bookId', 'title author');
        
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        
        // Check authorization
        if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const add_order = async (req, res) => {
    try {
        const { books, couponCode, shippingAddress, paymentMethod } = req.body;
        
        if (!books || books.length === 0) {
            return res.status(400).json({ success: false, message: 'No books in order' });
        }
        
        // Calculate subtotal
        let subtotal = 0;
        const enrichedBooks = [];
        
        for (const item of books) {
            const book = await Book.findById(item.bookId);
            if (!book) return res.status(404).json({ success: false, message: `Book ${item.bookId} not found` });
            
            const price = item.price || book.price;
            enrichedBooks.push({
                bookId: item.bookId,
                quantity: item.quantity,
                status: item.status,
                price: price,
                shippingMethod: item.shippingMethod || null,
                returned: false
            });
            subtotal += price * item.quantity;
        }
        
        // Apply coupon (simple)
        let discountAmount = 0;
        if (couponCode && couponCode.toUpperCase() === 'WELCOME10') {
            discountAmount = subtotal * 0.1;
        }
        
        // Check inventory
        await updateBookStock(enrichedBooks, 'decrease');
        
        // Create order
        const hasRentals = enrichedBooks.some(b => b.status === 'rent');
        const rentalEndDate = hasRentals ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null;
        
        const order = await Order.create({
            userId: req.user.id,
            books: enrichedBooks,
            couponCode: couponCode || null,
            discountAmount,
            subtotal,
            totalAmount: subtotal - discountAmount,
            rentalEndDate,
            shippingAddress: shippingAddress || {},
            paymentMethod,
            paymentStatus: 'pending'
        });
        
        const populatedOrder = await Order.findById(order._id)
            .populate('books.bookId', 'title author');
        
        res.status(201).json({ success: true, message: 'Order created', data: populatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const update_order_status = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin only' });
        }
        
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        
        order.orderStatus = req.body.orderStatus || order.orderStatus;
        order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
        
        await order.save();
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
export const cancel_order = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not your order' });
        }
        if (order.orderStatus !== 'pending') {
            return res.status(400).json({ success: false, message: 'Can only cancel pending orders' });
        }
        
        await updateBookStock(order.books, 'increase');
        order.orderStatus = 'cancelled';
        await order.save();
        
        res.status(200).json({ success: true, message: 'Order cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Return rental books
// @route   PUT /api/orders/:id/return
// @access  Private
export const return_rental_books = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not your order' });
        }
        
        let returned = 0;
        for (const book of order.books) {
            if (book.status === 'rent' && !book.returned) {
                book.returned = true;
                book.returnDate = new Date();
                returned++;
                await updateBookStock([book], 'increase');
            }
        }
        
        await order.save();
        res.status(200).json({ success: true, message: `${returned} book(s) returned` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};