document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Scroll to "Our Services" when "Get Started" is clicked
document.getElementById('get-started').addEventListener('click', function () {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
});

// Back to top button visibility and functionality
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', function () {
    if (window.scrollY > window.innerHeight) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
VanillaTilt.init(document.querySelector(".image-container"), {
    max: 45, // Maximum tilt
    speed: 500, // Animation speed

});
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="#services"]').forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default jump

            const targetElement = document.querySelector("#services");

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50, // Adjust offset for fixed header
                    behavior: "smooth"
                });
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="#contact"]').forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default jump

            // Scroll to the bottom of the page
            window.scrollTo({
                top: document.body.scrollHeight, // Scroll to the bottom
                behavior: "smooth" // Smooth scrolling
            });
        });
    });
});



