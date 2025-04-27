export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    }
}
export const updateUserImage = async (req, res) => {
  
}
export const updateUserPassword = async (req, res) => {
  
}