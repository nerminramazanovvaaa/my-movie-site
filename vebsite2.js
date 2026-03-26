document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        // Backend-ə sorğu göndəririk
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const result = await response.json();

        if (result.success) {
            alert("Uğurla giriş etdiniz!");
            
            // Saytı açırıq
            document.querySelector('.login-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            document.body.style.overflow = "visible"; 
            document.body.style.height = "auto";
            
            // Funksiyaları işə salırıq
            setupFeatures(); 
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Bağlantı xətası:", error);
        alert("Serverə qoşulmaq mümkün olmadı!");
    }
});

// Digər funksiyalar (Axtarış, Ulduz və s.) bura yığılıb
function setupFeatures() {
    // Axtarış sistemi
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        document.querySelectorAll('.movie-card').forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(searchText) ? "block" : "none";
        });
    });

    // Ulduz sistemi
    document.querySelectorAll('.fav-star').forEach(star => {
        star.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
            this.style.color = icon.classList.contains('fas') ? '#ffc107' : 'rgba(255,255,255,0.6)';
        });
    });
}