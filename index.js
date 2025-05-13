const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://ramasamy:ramasamy123@trainees.cweud9i.mongodb.net/kumarDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




//  READ - Get all users
app.get('/api/users/allusers', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  READ - Get a user by Email

app.post('/api/users/getuser', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//  CREATE - Add a new user
app.post('/api/users/adduser', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' }); // 409 = Conflict
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



//  UPDATE - Update a user
app.put('/api/users/updateuser', async (req, res) => {
  try {
    const { email, ...updates } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


//  DELETE - Delete a user
app.delete('/api/users/deleteuser', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
