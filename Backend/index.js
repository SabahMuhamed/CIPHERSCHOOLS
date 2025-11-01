const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Usermodel = require("./models/Users");
const Filemodel = require("./models/UserFile");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3001;


mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(" MongoDB Connection Error:", err));


app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await Usermodel.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            if (existingUser.username === username)
                return res.status(400).json({ message: "Username already exists" });
            if (existingUser.email === email)
                return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Usermodel.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        console.error(" Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Usermodel.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(" Login Error:", err);
        res.status(500).json({ message: "Login failed" });
    }
});


app.post("/save", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const ownerId = decoded.id;
        const { files } = req.body;

        let userFiles = await Filemodel.findOne({ ownerId });

        if (userFiles) {
            userFiles.files = files;
            await userFiles.save();
        } else {
            await Filemodel.create({ ownerId, files });
        }

        res.json({ message: "Files saved successfully" });
    } catch (err) {
        console.error(" Save Error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

app.get("/getFiles/:userId", async (req, res) => {
    try {
        const userFiles = await Filemodel.findOne({ ownerId: req.params.userId });
        res.json(userFiles ? userFiles.files : {});
    } catch (err) {
        console.error(" Get Files Error:", err);
        res.status(500).json({ message: "Error loading files" });
    }
});

app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

