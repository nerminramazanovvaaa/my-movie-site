document.addEventListener('DOMContentLoaded', () => { //bütün elementlər yükləndikdən sonra kodları işə salır.
    const loginForm = document.getElementById('loginForm'); // HTML-dəki giriş formasını tapıb dəyişənə mənimsədir.
    const mainContent = document.getElementById('main-content'); // Filmlər olan əsas məzmun hissəsini mənimsədir.

    // Login
    loginForm.addEventListener('submit', async (e) => { //düyməyə basandabu funksiyanı başladır.
        e.preventDefault(); // Form avtomatik olaraq səhifəni yeniləmir.
        const username = loginForm.username.value; // İstifadəçi adında yazılan dəyəri götürür.
        const password = loginForm.password.value; // Şifrəni götürürr.
        try { // Serverə giriş məlumatlarını JSON formatında POST sorğusu ilə göndərir.
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json(); // Serverdən gələn cavabı js obyektinə çevirir.
            if (data.success) {
                alert(data.message); // giriş uğurludursa ekranda serverdən gələn- backend) uğurlu giriş mesajını göstərir.
                document.querySelector('.login-container').style.display = 'none';
                mainContent.style.display = 'block'; // filmler olan hissəni ekranda görünən edir.
                document.body.style.overflow = 'auto'; //scroll verir 
                document.body.style.height = 'auto'; 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Giriş xətası:", error);
            alert("Serverlə əlaqə qurula bilmədi!");
        }
    });

    // Register
    const registerLink = document.querySelector('.register-link a'); // Qeydiyyat linkini HTML elementləri arasından tapır.
    registerLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = loginForm.username.value; // Formdakı istifadəçi adını dəyişənə mənimsədir.
        const password = loginForm.password.value;
        if (!username || !password) { // Ad və ya şifrə boşdursa, qeydiyyat prosesini dayandırır.
            alert("Zəhmət olmasa əvvəlcə istifadəçi adı və şifrəni yazın!");
            return; //dayandırma.
        }
        try { // Yeni istifadəçi məlumatlarını qeydiyyat üçün serverə göndərir.
            const res = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json(); // Serverin qeydiyyat cavabını mətn formatında qəbul edir. success ve false yeni 
            alert(data.success ? "Qeydiyyatdan keçildi!" : "Xəta: " + data.message);
        } catch (error) {
            console.error("Qeydiyyat xətası:", error);
            alert("Serverlə əlaqə qurulmur!");
        }
    });

    // Password reset
    const forgotPassword = document.getElementById('forgotPassword'); // Şifrəni unutdum düyməsini html deki id vasitəsilə tapır.
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault(); // Linkin səhifəni yeniləməsinə mane olur. Çünku bu defaultdur.
        // İstifadəçidən məlumat almaq üçün ekranda giriş qutusu açır.
        const info = prompt("Şifrəni bərpa etmək üçün email və ya telefon nömrənizi daxil edin:");
        if (info) alert("Sizə gələn bildiriş üzərindən şifrənizi yeniləyin!");
    });

    // Search
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-container input');
    const performSearch = () => { // Filmləri axtarıb ekranda süzgəcdən keçirən əsas funksiyadır.
        const term = searchInput.value.toLowerCase().trim(); // Yazılan mətni kiçik hərflərə çevirir və boşluqları silir.
        document.querySelectorAll('.movie-card').forEach(card => { // Bütün film kartlarını tək-tək yoxlayaraq dövr edir.
            const title = card.querySelector('h3').innerText.toLowerCase(); // Filmin adını kiçik hərflərlə oxuyur.
            const genre = card.querySelector('.genre').innerText.toLowerCase(); // Filmin janrını kiçik hərflərlə oxuyur.
            card.style.display = (title.includes(term) || genre.includes(term)) ? 'block' : 'none'; // Axtarılan söz ad və ya janrda varsa kartı göstərir, yoxdursa gizlədir.
        });
    };
    if (searchBtn) searchBtn.addEventListener('click', performSearch); // Axtarış düyməsinə kliklədikdə axtarış funksiyasını çağırır.
    if (searchInput) searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') performSearch(); }); // Axtarış qutusunda Enter düyməsi basıldıqda axtarış funksiyasını çağırır.

    // Ticket button 
    document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.ticket-btn');
    if (!btn) return;

    const movieCard = btn.closest('.movie-card'); //hansi movie cardın butonuna basıldığını tapır.
    const title = movieCard.querySelector('h3').innerText; // Film kartındakı adı oxuyur.
    const genre = movieCard.querySelector('.genre').innerText; //janrı

    // Rəqəmləri daha dəqiq götürmək üçün:
    const priceRaw = movieCard.querySelector('.price').innerText; //qiyməti
    const price = parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || 0;

    const imdbRaw = movieCard.querySelector('.imdb').innerText; //imdb xalını
    const imdb_rating = parseFloat(imdbRaw.replace(/[^0-9.]/g, '')) || 0; //onluq kesre çevirmek uçundur.

    const now = new Date(); //alındığı tarix
    const movie_time = now.toISOString().slice(0, 19).replace('T', ' ');

    console.log("Göndərilən:", { title, genre, price, imdb_rating, movie_time }); //konsola çıxarır.

    try { //bilet məlumatlarını əlavə etmək üçün serverə POST sorğusu göndərir.
        const res = await fetch('http://localhost:3000/addMovie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, genre, price, imdb_rating, movie_time })
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Server xətası");
        }
        const data = await res.json();
        alert(data.message);
    } catch (err) {
        console.error("Xəta:", err);
        alert("Xəta baş verdi: " + err.message);
    }
});
});
