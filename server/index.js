const express = require("express");
const users = require("./mongo");
const cors = require("cors");
const bcrypt = require('bcrypt');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const scrapeSongs = require('./scrapers/searchResults'); 
const scrapeSongData = require('./scrapers/tab4uScraper');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    },
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('A client connected', socket.id);

    socket.on('adminSongSelected', (song) => {
        io.emit('songSelected', song);
    });

    socket.on('quitSong', (role) => {
        if (role === 'admin') {
            socket.broadcast.emit('quitSong', { role: 'player' });
        }
    });

    socket.on('disconnect', () => {
    });
});


app.get("/", (req, res)=>{
    res.json({message:"check"});
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await users.findOne({ username: username });

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            if (isPasswordCorrect) {
                res.json({ message: "login successful", username: user.username, role: user.instrument });
            } else {
                res.json("incorrect password");
            }
        } else {
            res.json("user not found");
        }
    } catch (error) {
        res.status(500).json("error during login");
    }
});

app.post("/signup", async(req, res)=>{
    const {username, password, instrument} = req.body;
    console.log("username: ", username);
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
});

app.get('/search-songs', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }
    const songs = await scrapeSongs(query);
    res.json(songs);
});


app.post('/api/scrape', async (req, res) => {
    const { songUrl } = req.body;

    if (!songUrl) {
        return res.status(400).json({ error: 'No song URL provided' });
    }

    try {
        const songData = await scrapeSongData(songUrl);
        res.json(songData);
    } catch (error) {
        console.error('Error while scraping the song:', error);
        res.status(500).json({ error: 'Failed to scrape the song' });
    }
});

server.listen(5000, '0.0.0.0', ()=>{
    console.log("Socket.IO server running on http://localhost:5000");
});

