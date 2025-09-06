// Rompus Health Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a navigation link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for all anchor links
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a link with a hash
        if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // Fixed header height
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navToggle) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        }
    });

    // Header scroll effect
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (header) {
            if (currentScrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 253, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = 'var(--shadow-sm)';
            } else {
                header.style.backgroundColor = 'var(--color-surface)';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = 'none';
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Initialize elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .workflow-step, .security-feature, .outcome-item, .team-member'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous messages
            clearFormMessages();
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const organizationInput = document.getElementById('organization');
            const messageInput = document.getElementById('message');
            
            // Get values
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const organization = organizationInput ? organizationInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            // Validation
            let isValid = true;
            const errors = [];
            
            if (!name) {
                errors.push('Full name is required');
                if (nameInput) nameInput.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else {
                if (nameInput) nameInput.style.borderColor = 'var(--color-border)';
            }
            
            if (!email) {
                errors.push('Email address is required');
                if (emailInput) emailInput.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else if (!isValidEmail(email)) {
                errors.push('Please enter a valid email address');
                if (emailInput) emailInput.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else {
                if (emailInput) emailInput.style.borderColor = 'var(--color-border)';
            }
            
            if (!message) {
                errors.push('Message is required');
                if (messageInput) messageInput.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else {
                if (messageInput) messageInput.style.borderColor = 'var(--color-border)';
            }
            
            if (!isValid) {
                showFormMessage(errors.join('. '), 'error');
                return;
            }
            
            // Simulate successful submission
            showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset border colors
            [nameInput, emailInput, organizationInput, messageInput].forEach(input => {
                if (input) input.style.borderColor = 'var(--color-border)';
            });
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message
    function showFormMessage(message, type) {
        clearFormMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message status status--${type}`;
        messageDiv.textContent = message;
        messageDiv.style.marginTop = 'var(--space-16)';
        
        // Insert after form
        if (contactForm && contactForm.parentNode) {
            contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
        }
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv && messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    // Clear form messages
    function clearFormMessages() {
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
    }

    // Active navigation highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('nav-active');
            }
        });
    }

    // Update active nav on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 10);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navToggle) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize on load
    updateActiveNavLink();
    
    // Log successful initialization
    console.log('Rompus Health website loaded successfully');
});