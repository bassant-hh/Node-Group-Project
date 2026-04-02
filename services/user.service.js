import User from "../models/User";

export const updateProgress = async (userId, bookId, currentPage, totalPages) => {
    const user = await User.findById(userId);
    
    let progress = user.readingProgress.find(p => p.bookId.toString() === bookId);
    
    if (!progress) {
        user.readingProgress.push({ bookId, lastPage: currentPage });
    } else {
        progress.lastPage = currentPage;
        
        if (currentPage >= totalPages && !progress.isCompleted) {
            progress.isCompleted = true;
            user.completedBooksCount += 1;
            
            if (user.completedBooksCount === 2) {
                user.wallet.balance += 100; 
            }
        }
    }
    
    await user.save();
    return user;
};