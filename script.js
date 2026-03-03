document.addEventListener('DOMContentLoaded', () => {

    /* =======================================
       1. PŁYNNE PRZEWIJANIE (Smooth Scroll)
       ======================================= */
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Ignoruj jeśli link nie zaczyna się od '#'
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /* =======================================
       2. SCROLL REVEAL (Płynne pojawianie się)
       ======================================= */
    // Konfiguracja obserwatora (kiedy element wchodzi w pole widzenia)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Uruchom animację gdy 15% elementu jest widoczne
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Dodajemy klasę aktywującą animację CSS
                entry.target.classList.add('reveal-active');

                // Przestajemy obserwować element by animacja zagrała tylko raz
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Wybieramy wszystkie elementy do animacji
    const revealElements = document.querySelectorAll('.glass-card, h2');

    // Nadajemy im style początkowe przez JS i zlecamy obserwację
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Pętla pomocnicza przypisująca style aktywne po dodaniu klasy
    // Zróbmy to w CSS-ie poprzez event listener lub nadписanie styli tutaj,
    // ale łatwiej wstrzyknąć małą logikę:
    document.addEventListener('scroll', () => {
        const activeCards = document.querySelectorAll('.reveal-active');
        activeCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });

});

/* =======================================
   3. GALERIA ZDJĘĆ Z MODAL
   ======================================= */
let currentImages = [];
let currentIndex = 0;

let modal = null;
let modalImg = null;
let captionText = null;

// Ensure DOM is fully loaded before getting elements, but we keep window methods global.
document.addEventListener('DOMContentLoaded', () => {
    modal = document.getElementById('gallery-modal');
    modalImg = document.getElementById('modal-img');
    captionText = document.getElementById('modal-counter');
});

// Globalna funkcja otwierająca galerię
window.openGallery = function (images) {
    if (!modal) {
        modal = document.getElementById('gallery-modal');
        modalImg = document.getElementById('modal-img');
        captionText = document.getElementById('modal-counter');
    }

    currentImages = images;
    currentIndex = 0;

    if (!modal) return;

    // Ukryj strzałki jeśli jest tylko jedno zdjęcie
    const navButtons = document.querySelectorAll('.modal-nav');
    if (images.length <= 1) {
        navButtons.forEach(btn => btn.style.display = 'none');
    } else {
        navButtons.forEach(btn => btn.style.display = 'block');
    }

    updateModalContent();
    modal.classList.add('active');

    // Zablokuj przewijanie tła
    document.body.style.overflow = 'hidden';
}

window.closeGallery = function () {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Przywróć scroll
}

window.changeImage = function (direction) {
    currentIndex += direction;

    // Zapętlaj galerię
    if (currentIndex >= currentImages.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = currentImages.length - 1;
    }

    updateModalContent();
}

function updateModalContent() {
    if (!modalImg) return;
    modalImg.src = currentImages[currentIndex];
    if (captionText) {
        captionText.innerHTML = `${currentIndex + 1} / ${currentImages.length}`;
    }
}

// Zamknij okno po kliknięciu w tło zewnętrz obrębu zdjęcia
window.onclick = function (event) {
    if (event.target == modal) {
        closeGallery();
    }
}

// Nawigacja klawiaturą (strzałki, escape)
document.addEventListener('keydown', function (event) {
    if (!modal || !modal.classList.contains('active')) return;

    if (event.key === 'Escape') {
        closeGallery();
    } else if (event.key === 'ArrowRight' && currentImages.length > 1) {
        changeImage(1);
    } else if (event.key === 'ArrowLeft' && currentImages.length > 1) {
        changeImage(-1);
    }
});
