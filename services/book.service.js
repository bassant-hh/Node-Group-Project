import Book from '../models/book.model.js';

/**
 * @desc    إنشاء كتاب جديد مع معالجة الـ Slug تلقائياً
 */
export const createBook = async (bookData) => {
    // 1. منطق الـ Slug: لو الـ Admin بعت اسم سلسلة، بنحوله لـ Slug برمجياً
    if (bookData.series && bookData.series.seriesName) {
        bookData.series.seriesSlug = bookData.series.seriesName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // حذف الرموز الغريبة
            .replace(/[\s_-]+/g, '-')  // تحويل المسافات لشرطات
            .replace(/^-+|-+$/g, '');  // حذف الشرطات من الأطراف
    }

    // 2. حفظ في الداتابيز
    const book = await Book.create(bookData);
    return book;
};

/**
 * @desc    جلب كل الكتب مع الفلترة (Category أو Series)
 */
export const getAllBooks = async (filters) => {
    const query = {};

    // فلترة بالتصنيف
    if (filters.category) {
        query.category = filters.category;
    }

    // فلترة بالسلسلة (باستخدام الـ Slug اللي عملناه)
    if (filters.seriesSlug) {
        query['series.seriesSlug'] = filters.seriesSlug;
    }

    return await Book.find(query).sort({ createdAt: -1 }); // ترتيب من الأحدث للأقدم
};

/**
 * @desc    جلب كتاب واحد بالـ ID
 */
export const getBookById = async (id) => {
    const book = await Book.findById(id);
    if (!book) {
        const error = new Error('عفواً، هذا الكتاب غير موجود في المكتبة');
        error.statusCode = 404;
        throw error;
    }
    return book;
};

/**
 * @desc    تحديث بيانات كتاب
 */
export const updateBook = async (id, updateData) => {
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
        new: true,           // يرجع البيانات بعد التعديل مش قبله
        runValidators: true  // يطبق شروط الـ Model (زي الـ min price) أثناء التعديل
    });

    if (!updatedBook) {
        const error = new Error('فشل التحديث، الكتاب غير موجود');
        error.statusCode = 404;
        throw error;
    }
    return updatedBook;
};

/**
 * @desc    حذف كتاب واحد
 */
export const deleteBook = async (id) => {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
        const error = new Error('لا يمكن الحذف، الكتاب غير موجود بالفعل');
        error.statusCode = 404;
        throw error;
    }
    return book;
};

/**
 * @desc    حذف مجموعة كتب (Batch Delete)
 */
export const deleteMultipleBooks = async (ids) => {
    if (!ids || !Array.isArray(ids)) {
        const error = new Error('يرجى تحديد قائمة الكتب المراد حذفها');
        error.statusCode = 400;
        throw error;
    }
    return await Book.deleteMany({ _id: { $in: ids } });
};