const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Sign up
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, "secretkey", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user list
exports.getUsers = async (req, res) => {
  let { search } = req.query;
  if (!search) search = "";
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).populate("role", "roleName accessModules");
    res.status(200).json({ list: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, role },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update multiple users with same data
exports.updateManyUsers = async (req, res) => {
  const { updateData } = req.body;
  try {
    const result = await User.updateMany({}, updateData);
    res.status(200).json(result);
  } catch (error) {
    console.log("err",error)
    res.status(500).json({ error: error.message });
  }
};

// Update multiple users with different data
exports.updateUsersIndividually = async (req, res) => {
  const { updates } = req.body;
  try {
    const updatePromises = updates.map(({ id, data }) =>
      User.findByIdAndUpdate(id, data, { new: true })
    );
    const results = await Promise.all(updatePromises);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Check user access to a module
exports.checkUserAccess = async (req, res) => {
  const { userId, module } = req.body;
  try {
    const user = await User.findById(userId).populate("role");
    const hasAccess = user?.role?.accessModules?.includes(module) || false;
    res.status(200).json({ hasAccess });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
