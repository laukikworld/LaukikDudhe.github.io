/*
* ===================================================================
* This script is wrapped in a DOMContentLoaded event listener.
* This is a good practice that ensures the HTML is fully loaded
* before the JavaScript tries to find elements on the page.
* ===================================================================
*/
document.addEventListener('DOMContentLoaded', () => {

    /*========== menu icon navbar ==========*/
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon) {
        menuIcon.onclick = () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        };
    }


    /*========== scroll sections active link & sticky header ==========*/
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const header = document.querySelector('.header');

    const handleScroll = () => {
        const top = window.scrollY;

        // --- Active link on scroll ---
        let currentSectionId = '';
        sections.forEach(sec => {
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                currentSectionId = id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href contains the ID of the currently visible section
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });

        // --- Sticky navbar ---
        if (header) {
            header.classList.toggle('sticky', top > 100);
        }

        // --- Close mobile menu when scrolling ---
        if (menuIcon && navbar) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }
    };

    window.addEventListener('scroll', handleScroll);


    /*========== dark light mode ==========*/
    const darkModeIcon = document.querySelector('#darkMode-icon');

    if (darkModeIcon) {
        darkModeIcon.onclick = () => {
            darkModeIcon.classList.toggle('bx-sun');
            document.body.classList.toggle('dark-mode');
        };
    }


    /*========== scroll reveal ==========*/
    ScrollReveal({
        distance: '80px',
        duration: 2000,
        delay: 200
    });

    ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
    ScrollReveal().reveal('.home-img img, .my-skills-container, .my-projects-box, .contact-me form', { origin: 'bottom' });
    ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
    ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });


    /*
    * ===================================================================
    * **NEW:** Contact Form Submission Logic
    * This handles sending your contact form data to Formspree correctly.
    * Remember to add id="contact-form" to your <form> tag in HTML.
    * ===================================================================
    */
    const form = document.getElementById('contact-form');

    async function handleSubmit(event) {
        event.preventDefault(); // This stops the browser from reloading the page
        
        // Create a temporary element to show the status message
        let status = document.createElement('p');
        status.style.marginTop = '15px'; // Add some space for the message

        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Thanks for your message! I will get back to you soon.";
                status.style.color = 'green';
                form.reset(); // Clear the form fields
            } else {
                const responseData = await response.json();
                if (Object.hasOwn(responseData, 'errors')) {
                    status.innerHTML = responseData["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form.";
                }
                status.style.color = 'red';
            }
        } catch (error) {
            status.innerHTML = "Oops! There was a problem submitting your form.";
            status.style.color = 'red';
        } finally {
            // Add the status message to the page
            form.appendChild(status);
            // Remove the message after 5 seconds
            setTimeout(() => {
                status.remove();
            }, 5000);
        }
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

});