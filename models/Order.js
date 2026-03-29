const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: [true, 'Book ID is required'],
        },
        orderDate: {
          type: Date,
          default: Date.now,
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        status: {
          type: String,
          enum: {
            values: ['rent', 'buy'],
            message: 'Status must be either rent or buy',
          },
          required: [true, 'Order status (rent/buy) is required'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required'],
          min: [0, 'Price cannot be negative'],
        },
        shippingMethod: {
          type: String,
          enum: {
            values: ['standard', 'express', 'overnight'],
            message: 'Invalid shipping method',
          },
          required: function () {
            return this.status === 'buy';
          },
        },
        // Track if rental has been returned
        returned: {
          type: Boolean,
          default: false,
        },
        returnDate: {
          type: Date,
        },
      },
    ],
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
        message: 'Invalid order status',
      },
      default: 'pending',
      index: true,
    },
    // Rental-specific fields (applicable if any book in order is rented)
    rentalStartDate: {
      type: Date,
    },
    rentalEndDate: {
      type: Date,
    },
    // Shipping address for purchases
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'cash_on_delivery'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ 'books.bookId': 1 });

// Virtual for checking if order has rental items
orderSchema.virtual('hasRentalItems').get(function () {
  return this.books.some(book => book.status === 'rent');
});

// Virtual for checking if order has purchase items
orderSchema.virtual('hasPurchaseItems').get(function () {
  return this.books.some(book => book.status === 'buy');
});

// Virtual for getting only rental items
orderSchema.virtual('rentalItems').get(function () {
  return this.books.filter(book => book.status === 'rent');
});

// Virtual for getting only purchase items
orderSchema.virtual('purchaseItems').get(function () {
  return this.books.filter(book => book.status === 'buy');
});

// Method to check if order is fully returned
orderSchema.methods.isFullyReturned = function () {
  const rentalBooks = this.books.filter(book => book.status === 'rent');
  if (rentalBooks.length === 0) return true;
  return rentalBooks.every(book => book.returned === true);
};

// Method to calculate rental duration in days
orderSchema.methods.getRentalDuration = function () {
  if (!this.rentalStartDate || !this.rentalEndDate) return 0;
  const diffTime = Math.abs(this.rentalEndDate - this.rentalStartDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Pre-save middleware to validate rental dates
orderSchema.pre('save', function (next) {
  // If there are rental items, ensure rental dates are set
  if (this.hasRentalItems) {
    if (!this.rentalStartDate) {
      this.rentalStartDate = new Date();
    }
    if (!this.rentalEndDate && this.rentalStartDate) {
      // Default rental period: 14 days
      this.rentalEndDate = new Date(this.rentalStartDate);
      this.rentalEndDate.setDate(this.rentalEndDate.getDate() + 14);
    }
    
    // Validate rental end date is after start date
    if (this.rentalEndDate <= this.rentalStartDate) {
      next(new Error('Rental end date must be after start date'));
    }
  }
  
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function (next) {
  // Calculate subtotal
  this.subtotal = this.books.reduce((total, book) => {
    return total + (book.price * book.quantity);
  }, 0);
  
  // Calculate total with discount
  this.totalAmount = this.subtotal - this.discountAmount;
  
  // Ensure total amount is not negative
  if (this.totalAmount < 0) {
    this.totalAmount = 0;
  }
  
  next();
});

// Static method to get user's active rentals
orderSchema.statics.getActiveRentals = async function (userId) {
  return this.find({
    userId,
    orderStatus: { $in: ['pending', 'processing', 'completed'] },
    'books.status': 'rent',
    'books.returned': false,
  }).populate('books.bookId');
};

// Static method to check overdue rentals
orderSchema.statics.getOverdueRentals = async function () {
  const now = new Date();
  return this.find({
    orderStatus: { $in: ['pending', 'processing', 'completed'] },
    'books.status': 'rent',
    'books.returned': false,
    rentalEndDate: { $lt: now },
  }).populate('userId books.bookId');
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;