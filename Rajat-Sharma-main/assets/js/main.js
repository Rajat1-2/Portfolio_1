// Type js Code
const select = (el, all = false) => {
    el = el.trim()
    if (all) {
        return [...document.querySelectorAll(el)]
    } else {
        return document.querySelector(el)
    }
}
const typed = select('.typed')
if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
    });
}

//toggle icon navbar
let menuToggle = document.querySelector('.menu-toggle');
let navbar = document.querySelector('.navbar');

if (menuToggle && navbar) {
    menuToggle.onclick = () => {
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('show');
    };
}

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (menuToggle && navbar) {
            menuToggle.classList.remove('active');
            navbar.classList.remove('show');
        }
    });
});

// scroll sections active link
let sections = document.querySelectorAll('section');
let navItems = document.querySelectorAll('.nav-item');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navItems.forEach(item => {
                item.classList.remove('active');
            });
            const activeNavItem = document.querySelector(`.nav-link[href*="${id}"]`)?.parentElement;
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
        }
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
};

//scroll 
document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Portfolio JS
document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.portfolio-sets');
    new Masonry(grid, {
        itemSelector: '.portfolioset',
        columnWidth: '.portfolioset',
        percentPosition: true
    });

    const filterButtons = document.querySelectorAll('.row-content li a');
    const gridItems = document.querySelectorAll('.portfolioset');

    // Function to filter and apply Masonry layout
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            filterButtons.forEach(link => link.classList.remove('on'));
            this.classList.add('on');

            gridItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.classList.remove('hidden'); // Show the item
                } else {
                    item.classList.add('hidden');    // Hide the item
                }
            });

            setTimeout(() => {
                new Masonry(grid, {
                    itemSelector: '.portfolioset',
                    columnWidth: '.portfolioset',
                    percentPosition: true
                });

                imagesLoaded(grid, function() {
                    masonryInstance.layout();
                  });
            }, 300);
        });
    });
});


Fancybox.bind("[data-fancybox='gallery']", {
    Toolbar: {
        display: ["close", "prev", "next"], // Show close, previous, and next buttons
    },
    // Thumbs: {
    //     autoStart: false, // Disable thumbnails by default
    // },
    infinite: true, // Enable infinite loop for navigation
});


//Animation skills 
const skillsection = document.querySelectorAll('.progress');

// Create the intersection observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add the 'active' class to start the animation when the element is in view
            entry.target.classList.add('open');
        }
    });
}, { threshold: 0.5 }); // 50% of the section needs to be visible to trigger

// Observe each section
skillsection.forEach(section => {
    observer.observe(section);
});

// EmailJS Configuration and Contact Form Handler
(function() {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded. Check if the CDN script is properly included.');
        return;
    }
    
    // Initialize EmailJS with your public key
    console.log('Initializing EmailJS...');
    emailjs.init("lfekhMMq4-CwQPD8D");
    console.log('EmailJS initialized successfully');
})();

// Contact form submission handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up contact form...');
    
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');

    console.log('Form elements found:', {
        contactForm: !!contactForm,
        submitBtn: !!submitBtn,
        submitText: !!submitText,
        loadingText: !!loadingText
    });

    if (contactForm) {
        console.log('Adding event listener to contact form');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!');

            // Show loading state
            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (loadingText) loadingText.style.display = 'inline';

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Send email using EmailJS
            // Updated with your actual service ID and template ID
            console.log('Sending email with data:', formData);
            emailjs.send('service_zol0n3l', 'template_1a3aime', formData)
                .then(function(response) {
                    // Success
                    console.log('Email sent successfully:', response);
                    
                    // Show success message
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Your message has been sent successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        alert('Message sent successfully!');
                    }

                    // Reset form
                    contactForm.reset();
                })
                .catch(function(error) {
                    // Error
                    console.error('Email sending failed:', error);
                    console.error('Error details:', error.text || error.message || error);
                    
                    // Show detailed error message
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to send message: ' + (error.text || error.message || 'Unknown error'),
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        alert('Failed to send message: ' + (error.text || error.message || 'Unknown error'));
                    }
                })
                .finally(function() {
                    // Reset button state
                    if (submitBtn) submitBtn.disabled = false;
                    if (submitText) submitText.style.display = 'inline';
                    if (loadingText) loadingText.style.display = 'none';
                });
        });
    }
});

