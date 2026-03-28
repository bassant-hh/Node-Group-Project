const get_orders = (req, res) => {
    res.status(200).json({ message: "Get all orders" });
};

const get_order_by_id = (req, res) => {
    res.status(200).json({ message: `Get order with ID: ${req.params.id}` });
};

const add_order = (req, res) => {
    res.status(201).json({ message: "Add a new order" });
};

module.exports = {
    get_orders,
    get_order_by_id,
    add_order
};