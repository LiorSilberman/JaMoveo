const express = require("express")
const users = require("./mongo")
const cors = require("cors")
const bcrypt = require('bcrypt');
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.get("/", cors(), (req, res)=>{

})


app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await users.findOne({ username: username });

        if (user) {
            // Compare the provided password with the stored hashed password
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            if (isPasswordCorrect) {
                // If password is correct, send a success response
                res.json("login successful");
            } else {
                // If password is incorrect, send an error response
                res.json("incorrect password");
            }
        } else {
            // If the user does not exist, send an error response
            res.json("user not found");
        }
    } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json("error during login");
    }
});

app.post("/signup", async(req, res)=>{
    const {username, password, instrument} = req.body;

    const data = {username:username, password:password, instrument:instrument};

    try{
        const checkUsername = await users.findOne({ username:username });

        if (checkUsername){
            res.json("exist");
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                username: username,
                password: hashedPassword,
                instrument: instrument
            };
            
            await users.insertMany([newUser]);
            res.json("user created");
        }
    }
    catch{
        res.json("notexist");
    }

})


app.listen(5000, ()=>{
    console.log("server is running up");
});