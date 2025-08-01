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
let menuIcon = document.querySelector('.menu');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    navbar.classList.toggle('show');
};

// scroll sections active link
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.header .nav li');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('.header .nav li a[href*=' + id + ']').parentElement.classList.add('active');
            });
        };
    });
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

