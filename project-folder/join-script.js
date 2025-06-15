document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);

    console.log("Join Us page loaded");

    const joinSection = document.querySelector('.join-section');

    // Animasi Masuk Fade in
    setTimeout(() => {
        if (joinSection) {
            joinSection.classList.add('visible');
        }
    }, 100);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.classList.contains('join-section')) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5});

    if (joinSection) {
        observer.observe(joinSection);
    }

    // Hamburger menu toggle for mobile
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }
});