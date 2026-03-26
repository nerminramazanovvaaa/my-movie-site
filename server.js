//bunlar server yaratmag ucun lazim olan kitabxanalardır.
const express = require('express'); //node.js framework'ü-işi sadel.hazir aletler ver. sorğu dövriyye id. edir
const cors = require('cors'); //mux domenlerden gelen sorğ. icaze verir. front backend arasinda elaqe q.
const bodyParser = require('body-parser'); //server gelen dataları onun basa duseceyi dilə çev.
const { Pool } = require('pg');//psql vb ile elaq ucun bağlanti y.

const app = express(); //express fr. basladir. yeni serveri b.
const port = 3000;

const pool = new Pool({ //serverin vb qosulmasi ucun butun m. daxildir:
    user: 'postgres',
    host: 'localhost',
    database: 'movie_db', //yaratdgin db adi
    password: '12345', //psql install edende verdiyin sifre
    port: 5432,
});

app.use(cors()); //icazeleri tenzimleyir
app.use(bodyParser.json()); //datalari serverin basa duse bileceyi dile cevirir.

// Login
app.post('/login', async (req, res) => { //ist daxl etdiyi melumatlari post metodu ile gizl. oturur.
    const { username, password } = req.body;//ist. yazdigi ad ve sifr goturur.
    try{
        const user = await pool.query(
            'SELECT *FROM users WHERE username=$1 AND password=$2',
            [username,password]
        );
        if (user.rows.length > 0){
            res.json ({success: true,message: 'Giriş uğurludur! '}); //bazada mlmt varsa 0 dan boyuk olacag ve tesdiq.
        } else{
            res.json ({success: false,message: 'İstifadəçi adı və ya şifrə yanlışdır! '});  
        }
    } catch (err){
        console.error(err);
        res.status(500).json({success: false, message:'Server xətası!'});//vb ile elaqe kesilib or daha basqa texniki prblm.
    }
});

// Register
app.post('/register', async (req, res) => { //yeni istfci yaratmag ucun
    const { username,password } = req.body;
    try{
        const exists = await pool.query('SELECT * FROM users WHERE username=$1', [username]); 
        if (exists.rows.length > 0) { // eyni adda istfc olmasn deye bazani yoxlyr.
            return res.json({success: false ,message:'Belə bir istifadəçi var.'}); //say 0 dan cox movcuddursa demeli coxdan var
        }
        await pool.query('INSERT INTO users (username,password) VALUES ($1,$2) ', [username,password]);
        res.json({success: true ,message:'Qeydiyyatdan keçildi!'});
    }   catch (err){
        console.error(err);
        res.status(500).json({success:false,message:'Xəta!'});
    }
    
});

// Bilet alma
app.post('/addMovie', async (req, res) => { //req (request)-gələn məlumat, res (response-istifadəçiyə verilen cavab.
    const { title, genre, price, imdb_rating, movie_time } = req.body; //frontdan gelen datalar ile tek tek adlar qiymetleri menimsedir

    if (!title || !genre || price === undefined || !imdb_rating || !movie_time) {
        return res.status(400).json({ success: false, message: "Məlumatlar tam deyil!" });
    } //Əgər biletin adı və ya qiyməti yazılmayıbsa, boş məlumatın bazaya getməsinə imkan vermir.

    try {
        await pool.query( //psql-ya əmr göndərir,bu 5 datanı əlavə et cədvələ..
            'INSERT INTO movies (title, genre, price, imdb_rating, movie_time) VALUES ($1, $2, $3, $4, $5)',//çelumatlar bazaya yazilir. 
            [title, genre, price, imdb_rating, movie_time] //$- qutular kimidir. melumatlar tehlukesizlik ucun bazaya bunun icinde oturulur.
        );
        res.json({ success: true, message: "Bilet alındı!" });
    } catch (err) {
        console.error("DATABASE ERROR:", err);
        res.status(500).json({ success: false, message: "Database xətası: " + err.message });
    }
});

app.listen(port, () => {
    console.log(`Server ${port} portunda işləyir 🚀`); //serverin islediyini bildirir.
});
