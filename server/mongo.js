const mongoose = require("mongoose");
require('dotenv').config();


/**
 * Connects to MongoDB using a URI provided in the environment variables.
 * The connection uses the Mongoose package to interface with MongoDB.
 * It logs a success message upon successful connection or an error if the connection fails.
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));



/**
 * Defines a Mongoose schema for users.
 * The schema specifies the structure of user documents within the MongoDB database.
 * It includes fields for username, password, and instrument.
 * - username: must be unique and is required.
 * - password: is required.
 * - instrument: is required and stores the type of instrument the user plays.
 */
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instrument: { type: String, required: true },
    });

const User = mongoose.model('users', UserSchema);


const AdminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instrument: { type: String, required: true },
    role: { type: String, default: 'admin' },
});

const Admin = mongoose.model('Admin', AdminUserSchema);



// Export the User model and Admin model to allow other parts of the application to interact with the collections.
module.exports = {
    User,
    Admin
};