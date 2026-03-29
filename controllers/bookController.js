const get_books = (req, res) => {
    res.status(200).json({ message: "Get all books" });
};

const get_book_by_id = (req, res) => {
    res.status(200).json({ message: `Get book with ID: ${req.params.id}` });
};

const add_book = (req, res) => {
    res.status(201).json({ message: "Add a new book" });
};

const update_book = (req, res) => {
    res.status(200).json({ message: `Update book with ID: ${req.params.id}` });
};

const delete_book = (req, res) => {
    res.status(200).json({ message: `Delete book with ID: ${req.params.id}` });
};

const delete_books = (req, res) => {
    res.status(200).json({ message: "Delete multiple books" });
};

module.exports = {
    get_books,
    get_book_by_id,
    add_book,
    update_book,
    delete_book,
    delete_books
};