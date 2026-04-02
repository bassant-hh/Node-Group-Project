import User from '../models/User.js';

export const updateProgressService = async (userId, bookId, currentPage, totalPages) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User Not Found");

    let progress = user.readingProgress.find(p => p.bookId.toString() === bookId);

    if (!progress) {
        user.readingProgress.push({ bookId, lastPage: currentPage });
    } else {
        progress.lastPage = currentPage;
        if (currentPage >= totalPages && !progress.isCompleted) {
            progress.isCompleted = true;
            user.completedBooksCount = (user.completedBooksCount || 0) + 1;
            if (user.completedBooksCount === 2) {
                user.wallet.balance = (user.wallet.balance || 0) + 100;
            }
        }
    }
    await user.save();
    return user;
};