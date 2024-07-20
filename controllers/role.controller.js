const Role = require('../models/Role');

// Create a new role
exports.createRole = async (req, res) => {
  const { roleName, accessModules, active } = req.body;
  try {
    const role = new Role({ roleName, accessModules, active });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a list of all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { roleName, accessModules, active } = req.body;
  try {
    const role = await Role.findByIdAndUpdate(id, { roleName, accessModules, active }, { new: true });
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    await Role.findByIdAndDelete(id);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
