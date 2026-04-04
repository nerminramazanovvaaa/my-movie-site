//BUNLARİ SİLİRİK DOTENV İSLEMESİ UCUN. 
//bunlar server yaratmag ucun lazim olan kitabxanalardır.
//const express = require('express'); //node.js framework'ü-işi sadel.hazir aletler ver. sorğu dövriyye id. edir
//const cors = require('cors'); //mux domenlerden gelen sorğ. icaze verir. front backend arasinda elaqe q.
//const bodyParser = require('body-parser'); //server gelen dataları onun basa duseceyi dilə çev.
//const { Pool } = require('pg');//psql vb ile elaq ucun bağlanti y.

//const app = express(); //express fr. basladir. yeni serveri b.
//const port = 3000;

//evvelki kod
//const pool = new Pool({ //serverin vb qosulmasi ucun butun m. daxildir:
//    user: 'postgres',
//    host: 'localhost',
//    database: 'movie_db', //yaratdgin db adi
//    password: '12345', //psql install edende verdiyin sifre
//    port: 5432,
//});

//yeni kod
require('dotenv').config(); // .env faylındakı məxfi məlumatları (parol, port və s.) oxuyub sistemə yükləyir
const express = require('express'); // Veb server yaratmaq üçün lazım olan əsas kitabxananı (framework) çağırır
const cors = require('cors'); // Brauzerlərin fərqli ünvanlardan (məsələn, 5500-dən 3000-ə) gələn sorğulara icazə verməsini təmin edir
const bodyParser = require('body-parser'); // Gələn JSON formatlı məlumatları proqramın başa düşəcəyi obyekt halına gətirir
const { Pool } = require('pg'); // PostgreSQL verilənlər bazası ilə əlaqə qurmaq üçün ist olunur

// Yeni əlavə etdiyimiz hissə
const bcrypt = require('bcrypt'); // Parolları təhlükəsiz şəkildə hashləmək və müqayisə etmək üçün istifadə olunan kitabxana

const app = express(); // Express tətbiqini başladır 
const port = 3000; // Serverin hansı port üzərindən dinləyəcəyini təyin edir (məsələn: localhost:3000)

const pool = new Pool({ 
    // .env faylından oxunan məlumatlarla verilənlər bazasına qoşulma ayarlarını konfiqurasiya edir
    user: process.env.db_user, // Verilənlər bazası istifadəçi adı
    host: process.env.db_host, // Bazanın yerləşdiyi ünvan (adətən localhost)
    database: process.env.db_name, // Qoşulacaq bazanın adı
    password: process.env.db_pass, // Bazanın giriş şifrəsi
    port: process.env.db_port, // PostgreSQL-in standart portu (5432)
});

app.use(cors()); // Bütün gələn sorğular üçün CORS (təhlükəsizlik icazəsi) qaydalarını aktiv edir
app.use(bodyParser.json()); // Serverə gələn bütün məlumatların avtomatik JSON kimi analiz edilməsini təmin edir

// Serveri işə salan funksiya
app.listen(port, () => {
    // Server uğurla işə düşəndə terminalda bu mesaj görünəcək
    console.log(`Server ${port} portunda işləyir 🚀`);
});



// Login
//kohne login hissesi silinir.
//app.post('/login', async (req, res) => { //ist daxl etdiyi melumatlari post metodu ile gizl. oturur.
//    const { username, password } = req.body;//ist. yazdigi ad ve sifr goturur.
//    try{
//        const user = await pool.query(
//            'SELECT *FROM users WHERE username=$1 AND password=$2',
//            [username,password]
//        );
//        if (user.rows.length > 0){
//            res.json ({success: true,message: 'Giriş uğurludur! '}); //bazada mlmt varsa 0 dan boyuk olacag ve tesdiq.
//        } else{
//            res.json ({success: false,message: 'İstifadəçi adı və ya şifrə yanlışdır! '});  
//        }
//    } catch (err){
//        console.error(err);
//        res.status(500).json({success: false, message:'Server xətası!'});//vb ile elaqe kesilib or daha basqa texniki prblm.
//    }
//});
//Yeni login hissesi yazilir.
// Giriş hissəsi - kimsə daxil olmaq istəyəndə bura işə düşür
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Yazılan ad və şifrəni götürürük

    try {
        // Bazada bu adda adam varmı deyə baxırıq
        const userResult = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
        
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0]; // Tapılan adamın məlumatlarını götür
            
            // Yazılan şifrə ilə bazadakı gizli (hash) şifrəni tutuşdururuq
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Şifrə düzdürsə, "keç içəri" deyirik
                res.json({ success: true, message: 'Giriş uğurludur!' });
            } else {
                // Şifrə səhvdirsə, xəbərdarlıq edirik
                res.json({ success: false, message: 'Şifrə yanlışdır!' });
            }
        } else {
            // Belə bir ad ümumiyyətlə yoxdursa
            res.json({ success: false, message: 'İstifadəçi tapılmadı!' });
        }
    } catch (err) {
        console.error(err); // Nəsə texniki problem olsa, konsola yaz
        res.status(500).json({ success: false, message: 'Server xətası!' });
    }
});
//yeni kod burda bitir.

// Register
//kohne register silinir.
//app.post('/register', async (req, res) => { //yeni istfci yaratmag ucun
//    const { username,password } = req.body;
//    try{
//        const exists = await pool.query('SELECT * FROM users WHERE username=$1', [username]); 
//        if (exists.rows.length > 0) { // eyni adda istfc olmasn deye bazani yoxlyr.
//            return res.json({success: false ,message:'Belə bir istifadəçi var.'}); //say 0 dan cox movcuddursa demeli coxdan var
//        }
//        await pool.query('INSERT INTO users (username,password) VALUES ($1,$2) ', [username,password]);
//        res.json({success: true ,message:'Qeydiyyatdan keçildi!'});
//    }   catch (err){
//        console.error(err);
//        res.status(500).json({success:false,message:'Xəta!'});
//    }
    
//});
//Yeni register kod.
// Qeydiyyat hissəsi - yeni istifadəçi yaratmaq üçün
app.post('/register', async (req, res) => {
    const { username, password } = req.body; // Yazılan ad və şifrəni götürürük

    try {
        // Əvvəlcə yoxlayırıq: bu adda adam artıq var?
        const exists = await pool.query('SELECT * FROM users WHERE username=$1', [username]); 
        if (exists.rows.length > 0) {
            // Varsa, "artıq belə bir istifadəçi var" deyirik
            return res.json({ success: false, message: 'Belə bir istifadəçi var.' });
        }

        // Şifrəni bazaya olduğu kimi qoymuruq, onu "hash"ləyib tanınmaz hala salırıq
        const hashedPassword = await bcrypt.hash(password, 10);

        // İndi isə həm adı, həm də həmin gizli (hash) şifrəni bazaya yazırıq
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        
        // Hər şey qaydasındadırsa, təbrik edirik
        res.json({ success: true, message: 'Qeydiyyatdan keçildi!' });
    } catch (err) {
        console.error(err); // Texniki xəta olsa bura düşür
        res.status(500).json({ success: false, message: 'Xəta baş verdi!' });
    }
});
//yeni kod burda bitir.

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
