// Navigation functionality
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target.getAttribute('data-target');

    // Hide all sections
    sections.forEach(section => {
      section.style.display = 'none';
    });

    // Show target section
    if (target) {
      document.getElementById(target).style.display = 'block';
    }
  });
});

// Open Chatbot Modal
function openChatbot() {
  document.getElementById('chatbotModal').style.display = 'flex';
}

// Close Chatbot Modal
function closeChatbot() {
  document.getElementById('chatbotModal').style.display = 'none';
}

// Send message in Chatbot
function sendMessage() {
  const input = document.getElementById('chatbotInput');
  const message = input.value;

  if (message) {
    const chatbotWindow = document.querySelector('.chatbot-window');
    chatbotWindow.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    input.value = ''; // Clear input

    // Simulate a bot response
    chatbotWindow.innerHTML += `<p><strong>Bot:</strong> Thank you for your message!</p>`;
    chatbotWindow.scrollTop = chatbotWindow.scrollHeight; // Scroll to bottom
  }
}

// Display the home section by default
document.getElementById('home').style.display = 'block';

function navigateToPage() {
    window.location.href = "chatbot.html"; // Replace with the actual page you want to navigate to
}

function toggleBookingForm() {
  const bookingSection = document.getElementById("book-now");
  if (bookingSection.style.display === "none" || bookingSection.style.display === "") {
      bookingSection.style.display = "block"; // Show the booking form
  } else {
      bookingSection.style.display = "none"; // Hide the booking form
  }
}

//star rating
document.querySelectorAll('.star-rating .star').forEach(star => {
  star.addEventListener('click', function() {
      const ratingValue = this.getAttribute('data-value');
      const consultantName = this.parentElement.getAttribute('data-consultant');

      // Update the displayed rating
      const ratingDisplay = this.parentElement.previousElementSibling;
      ratingDisplay.setAttribute('data-rating', ratingValue);
      ratingDisplay.textContent = '★'.repeat(ratingValue) + '☆'.repeat(5 - ratingValue); // Update the display
      
      // Add selected class to highlight selected stars
      const stars = this.parentElement.querySelectorAll('.star');
      stars.forEach(s => {
          s.classList.remove('selected');
      });

      for (let i = 0; i < ratingValue; i++) {
          stars[i].classList.add('selected');
      }

      // Here you could also send the rating to a server via AJAX
      console.log(`Rated ${consultantName} with ${ratingValue} stars.`);
  });
});


