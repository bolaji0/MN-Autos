/**
 * M N AUTOS LTD - Main JavaScript File
 * This file contains all the functionality for the website.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initSmoothScroll();
    initScrollAnimation();
    initGallery();
    initTestimonialsSlider();
    initBackToTop();
    initContactForm();
    
    // Force gallery visibility
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.style.display = 'block';
        console.log('Gallery section initialized and forced visible');
        
        // Ensure gallery grid is visible
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            galleryGrid.style.display = 'grid';
            console.log('Gallery grid forced visible');
        }
    }
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.querySelector('header');

    // Toggle mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active menu item based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Scroll Animation (AOS-like functionality without the library)
 */
function initScrollAnimation() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.85) &&
            rect.bottom >= 0
        );
    }
    
    // Add animation class when element is in viewport
    function checkAnimations() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('aos-animate');
            }
        });
    }
    
    // Check on initial load
    checkAnimations();
    
    // Check on scroll
    window.addEventListener('scroll', checkAnimations);
}

/**
 * Gallery & Modal Functionality
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    let currentImgIndex = 0;
    
    // Open modal when gallery item is clicked
    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-info h3').textContent;
                const description = item.querySelector('.gallery-info p').textContent;
                
                modal.style.display = 'block';
                modalImg.src = img.src;
                modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
                currentImgIndex = index;
                
                // Disable scrolling on body when modal is open
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside of image
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Navigate to previous image
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentImgIndex = (currentImgIndex - 1 + galleryItems.length) % galleryItems.length;
            updateModalImage();
        });
    }
    
    // Navigate to next image
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentImgIndex = (currentImgIndex + 1) % galleryItems.length;
            updateModalImage();
        });
    }
    
    // Update modal image and caption
    function updateModalImage() {
        const currentItem = galleryItems[currentImgIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.querySelector('.gallery-info h3').textContent;
        const description = currentItem.querySelector('.gallery-info p').textContent;
        
        modalImg.src = img.src;
        modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                currentImgIndex = (currentImgIndex - 1 + galleryItems.length) % galleryItems.length;
                updateModalImage();
            } else if (e.key === 'ArrowRight') {
                currentImgIndex = (currentImgIndex + 1) % galleryItems.length;
                updateModalImage();
            } else if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
}

/**
 * Testimonials Slider
 */
function initTestimonialsSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    // Function to show testimonial by index
    function showTestimonial(index) {
        // Remove active class from all testimonials and dots
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current testimonial and dot
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            let newIndex = currentIndex + 1;
            if (newIndex >= testimonialCards.length) {
                newIndex = 0;
            }
            showTestimonial(newIndex);
        });
    }
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = testimonialCards.length - 1;
            }
            showTestimonial(newIndex);
        });
    }
    
    // Dot click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Auto slide every 5 seconds
    const autoSlide = setInterval(function() {
        let newIndex = currentIndex + 1;
        if (newIndex >= testimonialCards.length) {
            newIndex = 0;
        }
        showTestimonial(newIndex);
    }, 5000);
    
    // Stop auto slide on user interaction
    [prevBtn, nextBtn, ...dots].forEach(element => {
        if (element) {
            element.addEventListener('click', function() {
                clearInterval(autoSlide);
            });
        }
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Contact Form Validation and Submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const phoneField = document.getElementById('phone');
            const serviceField = document.getElementById('service');
            const messageField = document.getElementById('message');
            
            // Basic validation
            let isValid = true;
            
            // Name validation
            if (nameField.value.trim() === '') {
                showError(nameField, 'Please enter your name');
                isValid = false;
            } else {
                clearError(nameField);
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                showError(emailField, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailField);
            }
            
            // Phone validation
            const phoneRegex = /^[0-9\s\+\-\(\)]{10,15}$/;
            if (!phoneRegex.test(phoneField.value.trim())) {
                showError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            } else {
                clearError(phoneField);
            }
            
            // Service validation
            if (serviceField.value === '') {
                showError(serviceField, 'Please select a service');
                isValid = false;
            } else {
                clearError(serviceField);
            }
            
            // Message validation
            if (messageField.value.trim() === '') {
                showError(messageField, 'Please enter your message');
                isValid = false;
            } else {
                clearError(messageField);
            }
            
            // If all fields are valid, submit the form
            if (isValid) {
                // In a real implementation, this would typically use AJAX to submit the form
                // For this example, we'll just simulate a successful submission
                
                // Disable submit button and show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Simulate form submission
                setTimeout(function() {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert-success';
                    successMessage.textContent = 'Your message has been sent successfully. We will contact you soon!';
                    contactForm.prepend(successMessage);
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    
                    // Remove success message after 5 seconds
                    setTimeout(function() {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }
    
    // Show error message
    function showError(field, message) {
        // Clear existing error
        clearError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create and append error message
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        field.parentNode.appendChild(errorMessage);
    }
    
    // Clear error message
    function clearError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

/**
 * CSS helper for scroll animations 
 * This adds the necessary CSS for the animations
 */
(function() {
    // Create style element
    const style = document.createElement('style');
    
    // Add CSS for form validation
    style.innerHTML = `
        .form-group .error {
            border-color: #d32f2f;
        }
        
        .error-message {
            color: #d32f2f;
            font-size: 0.85rem;
            margin-top: 5px;
            display: block;
        }
        
        .alert-success {
            background-color: #28a745;
            color: white;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
    `;
    
    // Append to head
    document.head.appendChild(style);
})();
