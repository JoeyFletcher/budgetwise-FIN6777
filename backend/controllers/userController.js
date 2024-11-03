const getUserDashboard = (req, res) => {
  // Assuming req.user is available after successful authentication
  const userId = req.user.userId;

  // Fetch user-specific data from the database
  // Example data to return
  const userData = {
    username: req.user.username,
    first_name: req.user.first_name, // Adding first_name to the response
    balance: 1000, // Replace this with actual balance retrieved from the DB
  };

  res.status(200).json(userData);
};

module.exports = { getUserDashboard };
