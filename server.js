const express = require('express');
const mysql = require('mysql2'); // Use mysql2
const bcrypt = require('bcrypt');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); // Initialize Socket.IO
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'your_database_name',
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('signup', async (data) => {
        const { name, email, password } = data;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(sql, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('MySQL query error:', err);
                    socket.emit('signupResult', { success: false, message: 'Error registering user.' });
                } else {
                    socket.emit('signupResult', { success: true, message: 'Registration successful!' });
                }
            });
        } catch (error) {
            console.error('bcrypt error:', error);
            socket.emit('signupResult', { success: false, message: 'Error registering user.' });
        }
    });

    socket.on('signin', async (data) => {
        const { email, password } = data;
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], async (err, results) => {
            if (err) {
                console.error('MySQL query error:', err);
                socket.emit('signinResult', { success: false, message: 'Error logging in.' });
            } else if (results.length > 0) {
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    socket.emit('signinResult', { success: true, message: 'Login successful!' });
                } else {
                    socket.emit('signinResult', { success: false, message: 'Invalid credentials.' });
                }
            } else {
                socket.emit('signinResult', { success: false, message: 'Invalid credentials.' });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});