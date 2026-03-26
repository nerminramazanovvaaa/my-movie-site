const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Middleware - Bunlar mütləq olmalıdır ki, server məlumatı oxuya bilsin
app.use(cors());
app.use(express.json());

// PostgreSQL bağlantısı
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vebsite2database', 
    password: '1', // Bura pgAdmin-ə girəndə yazdığın parolu yaz (əgər 1-dirsə belə qalsın)
    port: 5432,
});

// LOGIN Yoxlaması (Həm Email, həm Telefon ilə)
app.post('/login', async (req, res) => {
    const { username, password } = req.body; 
    
    try {
        // SQL: Email VƏ YA Telefon nömrəsi uyğun gələni tap
        const result = await pool.query(
            'SELECT * FROM users WHERE (email = $1 OR phone = $1) AND password_hash = $2', 
            [username, password]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, message: "Xoş gəldiniz! Giriş uğurludur." });
        } else {
            res.json({ success: false, message: "Email/Telefon və ya şifrə səhvdir!" });
        }
    } catch (err) {
        console.error("Baza xətası:", err);
        res.status(500).json({ success: false, message: "Serverdə texniki xəta baş verdi." });
    }
});

// Serveri işə sal
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend ${PORT}-ci portda hazırdır!`);
});