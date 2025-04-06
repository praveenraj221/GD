// JavaScript for Subscription Page

// Get all "Select Plan" buttons
const selectPlanButtons = document.querySelectorAll('.select-plan-btn');

// Get the modal element
const modal = document.querySelector('.modal');

// Get the close button for the modal
const closeModalButton = document.querySelector('.close-btn');

// Get the plan details element inside the modal
const modalPlanDetails = document.querySelector('#modal-plan-details');

// Get the confirm subscription button
const confirmSubscribeButton = document.querySelector('#confirm-subscribe');

// Variable to store the selected plan
let selectedPlan = '';

// Function to open the modal
function openModal(planDetails) {
    modalPlanDetails.textContent = planDetails;
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
}

// Function to handle plan selection
function handlePlanSelection(planName) {
    selectedPlan = planName;
    openModal(`You have selected the ${planName} plan.`);
}

// Add event listeners to all "Select Plan" buttons
selectPlanButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const planName = event.target.dataset.plan;
        handlePlanSelection(planName);
    });
});

// Add event listener to close button
closeModalButton.addEventListener('click', closeModal);

// Add event listener to confirm subscription button
confirmSubscribeButton.addEventListener('click', () => {
    alert(`Thank you for subscribing to the ${selectedPlan} plan!`);
    closeModal();
});

// Close the modal if the user clicks outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

/* Animations and User Experience Enhancements */

// Smooth Scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Testimonials Auto-Scroll Feature
let testimonialIndex = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showNextTestimonial() {
    testimonials[testimonialIndex].classList.remove('active-testimonial');
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    testimonials[testimonialIndex].classList.add('active-testimonial');
}

// Auto-scroll testimonials every 5 seconds
setInterval(showNextTestimonial, 5000);

// Add hover effects to the subscription plan cards
const planCards = document.querySelectorAll('.plan-card');

planCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.3)';
        card.style.transform = 'scale(1.05)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        card.style.transform = 'scale(1)';
    });
});

// Lazy loading for images (for optimization)
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        let lazyLoadThrottleTimeout;
        function lazyload() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }

            lazyLoadThrottleTimeout = setTimeout(function () {
                let scrollTop = window.pageYOffset;
                lazyImages.forEach(function (img) {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });

                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyload);
                    window.removeEventListener('resize', lazyload);
                    window.removeEventListener('orientationChange', lazyload);
                }
            }, 20);
        }

        document.addEventListener('scroll', lazyload);
        window.addEventListener('resize', lazyload);
        window.addEventListener('orientationChange', lazyload);
    }
});

