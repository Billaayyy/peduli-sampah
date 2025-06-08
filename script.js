document.addEventListener("DOMContentLoaded", () => {
    // Force the page to start at the top
    window.scrollTo(0, 0);

    console.log("Peduli Sampah website loaded!");

    const heroSection = document.querySelector('.hero');
    const contentSection = document.querySelector('.content-section');
    const joinSection = document.querySelector('.join-section');


    setTimeout(() => {
        if (heroSection) {
            heroSection.classList.add('visible');
        }
    }, 100); 

    setTimeout(() => {
        if (joinSection) {
            joinSection.classList.add('visible');
        }
    }, 100);
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    contentSection.classList.add('visible'); 
                }
            });
        },
        { threshold: 0.5 } 
    );

    if (contentSection) {
        observer.observe(contentSection);
    }
});