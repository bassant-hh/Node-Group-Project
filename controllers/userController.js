const register = (req, res) => {
    res.status(201).json({ message: "Register new user" });
};

const login = (req, res) => {
    res.status(200).json({ message: "User login" });
};

const refresh_token = (req, res) => {
    res.status(200).json({ message: "Refresh token" });
};

const logout = (req, res) => {
    res.status(200).json({ message: "User logout" });
};

const update_info = (req, res) => {
    res.status(200).json({ message: "Update user info" });
};

module.exports = {
    register,
    login,
    refresh_token,
    logout,
    update_info
};