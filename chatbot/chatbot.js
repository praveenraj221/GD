const dataset = { 
    "hi": "Hello, farmer! How can I assist you today?",
    "how are you": "I'm here to help you with your farming queries!",
    "what's your name": "I am your CropCare Assistant.",
    
    "weather update": "Please check a reliable weather service for real-time updates.",
    
    "soil health": {
        response: "Soil testing is essential. Consider using organic manure or compost to improve fertility.",
        advice: "You can also rotate crops to maintain soil balance."
    },
    
    "best fertilizer for wheat": {
        response: "For wheat, use NPK fertilizer in a 4:2:1 ratio.",
        advice: "Apply at different growth stages for better yield."
    },

    "how to control pests": {
        response: "Use neem oil spray or natural predators like ladybugs.",
        advice: "Crop rotation and intercropping can also reduce pests."
    },

    "which pesticide is best for tomato": {
        response: "For tomato plants, use Bacillus thuringiensis or neem-based pesticides.",
        advice: "Avoid excessive chemicals; organic solutions work well."
    },

    "best irrigation method": {
        response: "Drip irrigation is best for water conservation.",
        advice: "It delivers water directly to roots, reducing wastage."
    },

    "crop diseases": {
        response: "Common diseases include blight, rust, and wilt. Early detection is crucial.",
        advice: "Use disease-resistant seeds and proper spacing between plants."
    },

    "best season to grow maize": {
        response: "Maize grows best in the rainy season (June to October).",
        advice: "Ensure well-drained soil and good sunlight exposure."
    },

    "how to increase yield": {
        response: "Use quality seeds, proper irrigation, and balanced fertilizers.",
        advice: "Timely pest control and soil testing can further improve yield."
    },

    "organic farming tips": {
        response: "Use compost, green manure, and crop rotation to maintain soil health.",
        advice: "Avoid chemical fertilizers and pesticides for a healthier yield."
    },

    "how to store grains": {
        response: "Store grains in dry, cool places in airtight containers.",
        advice: "Use neem leaves or fumigation to prevent pests."
    }
};


// Select UI elements
const messagesDiv = document.getElementById("messages");
const textInput = document.getElementById("textInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const imageInput = document.getElementById("imageInput");
const imageBtn = document.getElementById("imageBtn");

let conversationState = null; // To track conversation context

// Add event listeners
sendBtn.addEventListener("click", sendMessage);
textInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

function handleResponse(userInput) {
    const inputLower = userInput.toLowerCase();

    // Handle various user inputs and provide responses
    if (dataset[inputLower]) {
        const data = dataset[inputLower];
        addMessage(data.response, 'bot');
        if (data.dosage) {
            addMessage(`Dosage: ${data.dosage}`, 'bot');
        }
        speakText(data.response); // Speak the exact response
    } else {
        addMessage("I'm sorry, I don't have information on that. Please ask something else.", 'bot');
        speakText("I'm sorry, I don't have information on that."); // Speak the fallback response
    }
}

// Voice assistant setup using Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

voiceBtn.addEventListener("click", () => {
    recognition.start();
});

recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript.toLowerCase();
    console.log("Recognized speech:", speechResult); // Debugging
    addMessage(speechResult, 'user');
    handleResponse(speechResult);
};

recognition.onerror = (event) => {
    console.error("Speech recognition error detected: " + event.error);
    addMessage("Sorry, I couldn't understand. Please try again.", 'bot');
};

// Image upload handling
imageBtn.addEventListener("click", () => {
    imageInput.click(); // Trigger file input
});

imageInput.addEventListener("change", handleImageUpload);

// Show loading indicator while analyzing the image
function showLoadingIndicator() {
    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'loadingIndicator';
    loadingMessage.textContent = 'Analyzing image...';
    loadingMessage.classList.add('message', 'bot');
    messagesDiv.appendChild(loadingMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}

// Remove loading indicator
function hideLoadingIndicator() {
    const loadingMessage = document.getElementById('loadingIndicator');
    if (loadingMessage) {
        messagesDiv.removeChild(loadingMessage);
    }
}

// Handle image upload
function handleImageUpload() {
    const file = imageInput.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            addMessage("Please upload a valid image file.", 'bot');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;
            // Display image in chat
            const imgElement = document.createElement('img');
            imgElement.src = imgData;
            imgElement.style.maxWidth = '100px'; // Optional: restrict image size in chat
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'user');
            messageDiv.appendChild(imgElement);
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            showLoadingIndicator(); // Show loading indicator
            setTimeout(() => {
                hideLoadingIndicator(); // Hide loading after analysis
                addMessage("Based on the image, Spray copper-based fungicides and remove infected leaves to stop the disease from spreading.", 'bot');
                speakText("Based on the image, Spray copper-based fungicides and remove infected leaves to stop the disease from spreading."); // Speak the analysis response
            }, 2000);
        };
        reader.readAsDataURL(file); // Read the image data
    }
}

// Send a message to the chatbot
function sendMessage() {
    const message = textInput.value.toLowerCase();
    if (message.trim() !== "") {
        addMessage(message, 'user');
        handleResponse(message);
        textInput.value = '';
    }
}

// Add a message to the chat window
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}

// Handle chatbot's response with contextual state
function handleResponse(userInput) {
    if (conversationState === 'feverTreatment') {
        if (userInput.includes("how often")) {
            addMessage("You can take Giloy twice a day after meals.", 'bot');
            speakText("You can take Giloy twice a day after meals."); // Speak the specific dosage response
            conversationState = null; // Reset state after answering
        } else {
            addMessage("For fever, Giloy is recommended. Do you want to know how often to take it?", 'bot');
            speakText("For fever, Giloy is recommended. Do you want to know how often to take it?"); // Speak the inquiry
        }
    } else if (userInput.includes("fever")) {
        addMessage("For fever, Giloy (Guduchi) is recommended. Take 2 spoons before meals, morning and evening.", 'bot');
        speakText("For fever, Giloy (Guduchi) is recommended. Take 2 spoons before meals, morning and evening."); // Speak the fever response
        conversationState = 'feverTreatment'; // Set state for further details
    } else if (userInput.includes("cold")) {
        addMessage("For cold , Tulsi and Sitopaladi Churna are commonly recommended.", 'bot');
        speakText("For cold, Tulsi and Sitopaladi Churna are commonly recommended."); // Speak the combined response
    } else if (userInput.includes("cough")) {
        addMessage("For cough, Tulsi and Sitopaladi Churna are commonly recommended.", 'bot');
        speakText("For cough, Tulsi and Sitopaladi Churna are commonly recommended.");
    }else if (userInput.includes("ayurveda")) {
        addMessage("Ayurveda is an ancient system of healing that focuses on balance between body, mind, and spirit.", 'bot');
        speakText("Ayurveda is an ancient system of healing that focuses on balance between body, mind, and spirit."); // Speak the Ayurveda response
    } else if (userInput.includes("piles")) {
        addMessage("For piles, Triphala and warm water are beneficial.", 'bot');
        speakText("For piles, Triphala and warm water are beneficial.");
    } else if (userInput.includes("indigestion")) {
        addMessage("For indigestion, take Triphala powder with warm water before bed to improve digestion.", 'bot');
        speakText("For indigestion, take Triphala powder with warm water before bed to improve digestion.");
    } else if (userInput.includes("acidity")) {
        addMessage("For acidity, consume amla juice or chew on fennel seeds after meals.", 'bot');
        speakText("For acidity, consume amla juice or chew on fennel seeds after meals.");
    } else if (userInput.includes("constipation")) {
        addMessage("For constipation, drink warm water with ghee before bedtime to help relieve symptoms.", 'bot');
        speakText("For constipation, drink warm water with ghee before bedtime to help relieve symptoms.");
    } else if (userInput.includes("joint pain")) {
        addMessage("For joint pain, massage with Mahanarayan oil and consume Guggulu supplements.", 'bot');
        speakText("For joint pain, massage with Mahanarayan oil and consume Guggulu supplements.");
    } else if (userInput.includes("insomnia")) {
        addMessage("For insomnia, consume Brahmi and Ashwagandha to calm the mind and promote restful sleep.", 'bot');
        speakText("For insomnia, consume Brahmi and Ashwagandha to calm the mind and promote restful sleep.");
    } else if (userInput.includes("weight loss")) {
        addMessage("For weight loss, Triphala and Guggulu are beneficial. Exercise regularly and drink lukewarm water.", 'bot');
        speakText("For weight loss, Triphala and Guggulu are beneficial. Exercise regularly and drink lukewarm water.");
    } else if (userInput.includes("skin problems")) {
        addMessage("For skin problems, apply neem and turmeric paste, and consume Aloe Vera juice.", 'bot');
        speakText("For skin problems, apply neem and turmeric paste, and consume Aloe Vera juice.");
    } else if (userInput.includes("hair loss")) {
        addMessage("For hair loss, use Bhringraj oil and consume Amla regularly for strong hair.", 'bot');
        speakText("For hair loss, use Bhringraj oil and consume Amla regularly for strong hair.");
    } else if (userInput.includes("high blood pressure")) {
        addMessage("For high blood pressure, consume garlic and Ashwagandha daily to help maintain levels.", 'bot');
        speakText("For high blood pressure, consume garlic and Ashwagandha daily to help maintain levels.");
    } else if (userInput.includes("diabetes")) {
        addMessage("For diabetes, Karela juice and Jamun seeds are highly effective in controlling sugar levels.", 'bot');
        speakText("For diabetes, Karela juice and Jamun seeds are highly effective in controlling sugar levels.");
    } else if (userInput.includes("cholesterol")) {
        addMessage("For cholesterol, consume Guggulu supplements and include garlic in your daily diet.", 'bot');
        speakText("For cholesterol, consume Guggulu supplements and include garlic in your daily diet.");
    } else if (userInput.includes("eye problems")) {
        addMessage("For eye problems, Triphala eyewash and Amla juice help improve vision.", 'bot');
        speakText("For eye problems, Triphala eyewash and Amla juice help improve vision.");
    } else if (userInput.includes("anemia")) {
        addMessage("For anemia, consume pomegranate and beetroot juice to increase iron levels.", 'bot');
        speakText("For anemia, consume pomegranate and beetroot juice to increase iron levels.");
    } else if (userInput.includes("immunity")) {
        addMessage("For boosting immunity, consume Tulsi, Giloy, and turmeric in your daily diet.", 'bot');
        speakText("For boosting immunity, consume Tulsi, Giloy, and turmeric in your daily diet.");
    }else if (userInput.includes("hi")) {
        addMessage("Hello! How can I assist you today?", 'bot');
        speakText("Hello! How can I assist you today?");
    } else if (userInput.includes("hello")) {
        addMessage("Hi there! How can I help you today?", 'bot');
        speakText("Hi there! How can I help you today?");
    } else if (userInput.includes("who are you")) {
        addMessage("Hello! I’m your AI-powered companion designed to guide you through the ancient wisdom of Ayurveda.", 'bot');
        speakText("Hello! I’m your AI-powered companion designed to guide you through the ancient wisdom of Ayurveda.");
    }else if (userInput.includes("how are you")) {
        addMessage("I'm functioning perfectly as a bot! How about you?", 'bot');
        speakText("I'm functioning perfectly as a bot! How about you?");
    } else if (userInput.includes("what's your name")) {
        addMessage("I am your advanced Ayurvedic assistant.", 'bot');
        speakText("I am your advanced Ayurvedic assistant.");
    } else if (userInput.includes("thank you")) {
        addMessage("You're welcome! If you have any more questions, feel free to ask.", 'bot');
        speakText("You're welcome! If you have any more questions, feel free to ask.");
    } else if (userInput.includes("bye")) {
        addMessage("Goodbye! Have a great day!", 'bot');
        speakText("Goodbye! Have a great day!");
    } else if (userInput.includes("see you later")) {
        addMessage("See you later! Take care!", 'bot');
        speakText("See you later! Take care!");
    } else if (userInput.includes("help")) {
        addMessage("I'm here to help! What information do you need?", 'bot');
        speakText("I'm here to help! What information do you need?");
    } else if (userInput.includes("what can you do")) {
        addMessage("I can provide Ayurvedic insights and remedies for various conditions. Ask me anything!", 'bot');
        speakText("I can provide Ayurvedic insights and remedies for various conditions. Ask me anything!");
    } else if (userInput.includes("good morning")) {
        addMessage("Good morning! How can I assist you today?", 'bot');
        speakText("Good morning! How can I assist you today?");
    } else if (userInput.includes("good evening")) {
        addMessage("Good evening! How can I assist you today?", 'bot');
        speakText("Good evening! How can I assist you today?");
    }else if (userInput.includes("what's up")) {
        addMessage("Not much! Just here to assist you. What about you?", 'bot');
        speakText("Not much! Just here to assist you. What about you?");
    } else if (userInput.includes("how's it going")) {
        addMessage("It's going great! Thanks for asking! How about you?", 'bot');
        speakText("It's going great! Thanks for asking! How about you?");
    } else if (userInput.includes("what are you doing")) {
        addMessage("I'm here to assist you with Ayurvedic insights! What do you need?", 'bot');
        speakText("I'm here to assist you with Ayurvedic insights! What do you need?");
    } else if (userInput.includes("how can I help you")) {
        addMessage("I appreciate your offer! Just asking questions is a great help.", 'bot');
        speakText("I appreciate your offer! Just asking questions is a great help.");
    } else if (userInput.includes("nice to meet you")) {
        addMessage("It's nice to meet you too! How can I assist you?", 'bot');
        speakText("It's nice to meet you too! How can I assist you?");
    } else if (userInput.includes("let's chat")) {
        addMessage("Absolutely! What would you like to talk about?", 'bot');
        speakText("Absolutely! What would you like to talk about?");
    } else if (userInput.includes("what do you mean")) {
        addMessage("Could you please clarify your question?", 'bot');
        speakText("Could you please clarify your question?");
    } else if (userInput.includes("I have a question")) {
        addMessage("Sure! I'm here to help. What's your question?", 'bot');
        speakText("Sure! I'm here to help. What's your question?");
    } else if (userInput.includes("what's the weather like")) {
        addMessage("I'm not sure about the weather. But I'm here for Ayurvedic insights!", 'bot');
        speakText("I'm not sure about the weather. But I'm here for Ayurvedic insights!");
    } else if (userInput.includes("what is ayurveda")) {
        addMessage("Ayurveda is an ancient system of healing that focuses on balance in life.", 'bot');
        speakText("Ayurveda is an ancient system of healing that focuses on balance in life.");
    } else if (userInput.includes("can you help me")) {
        addMessage("Of course! What do you need help with?", 'bot');
        speakText("Of course! What do you need help with?");
    } else if (userInput.includes("I need assistance")) {
        addMessage("I'm here to assist you! Please tell me what you need.", 'bot');
        speakText("I'm here to assist you! Please tell me what you need.");
    } else if (userInput.includes("are you a robot")) {
        addMessage("Yes, I am an AI assistant designed to help you with Ayurvedic information.", 'bot');
        speakText("Yes, I am an AI assistant designed to help you with Ayurvedic information.");
    } else if (userInput.includes("do you have any advice")) {
        addMessage("I have plenty of Ayurvedic advice! What do you want to know?", 'bot');
        speakText("I have plenty of Ayurvedic advice! What do you want to know?");
    } else if (userInput.includes("what should I eat")) {
        addMessage("It depends on your body type. Let me know your dosha for specific advice.", 'bot');
        speakText("It depends on your body type. Let me know your dosha for specific advice.");
    } else if (userInput.includes("what's your favorite herb")) {
        addMessage("I don't have favorites, but Tulsi is highly regarded in Ayurveda!", 'bot');
        speakText("I don't have favorites, but Tulsi is highly regarded in Ayurveda!");
    } else if (userInput.includes("can you tell me a remedy")) {
        addMessage("Absolutely! Please specify the condition you need a remedy for.", 'bot');
        speakText("Absolutely! Please specify the condition you need a remedy for.");
    } else if (userInput.includes("how can I improve my health")) {
        addMessage("Consider a balanced diet, regular exercise, and Ayurvedic practices.", 'bot');
        speakText("Consider a balanced diet, regular exercise, and Ayurvedic practices.");
    } else if (userInput.includes("what is your purpose")) {
        addMessage("My purpose is to provide you with Ayurvedic insights and assistance.", 'bot');
        speakText("My purpose is to provide you with Ayurvedic insights and assistance.");
    } else if (userInput.includes("tell me something interesting")) {
        addMessage("Did you know that Ayurveda has been practiced for over 5000 years?", 'bot');
        speakText("Did you know that Ayurveda has been practiced for over 5000 years?");
    } else if (userInput.includes("how old are you")) {
        addMessage("I don’t have an age like humans do. I was created to assist you.", 'bot');
        speakText("I don’t have an age like humans do. I was created to assist you.");
    } else if (userInput.includes("what's your opinion")) {
        addMessage("I don't have opinions, but I can provide information based on Ayurveda.", 'bot');
        speakText("I don't have opinions, but I can provide information based on Ayurveda.");
    } else if (userInput.includes("what's your favorite food")) {
        addMessage("I don't eat, but Ayurvedic dishes like Kitchari are nutritious!", 'bot');
        speakText("I don't eat, but Ayurvedic dishes like Kitchari are nutritious!");
    } else if (userInput.includes("how do you work")) {
        addMessage("I use artificial intelligence to understand and respond to your queries.", 'bot');
        speakText("I use artificial intelligence to understand and respond to your queries.");
    } else if (userInput.includes("what's your skill")) {
        addMessage("My skill is providing Ayurvedic remedies and health insights.", 'bot');
        speakText("My skill is providing Ayurvedic remedies and health insights.");
    } else if (userInput.includes("tell me a joke")) {
        addMessage("Why did the doctor carry a red pen? In case he needed to draw blood!", 'bot');
        speakText("Why did the doctor carry a red pen? In case he needed to draw blood!");
    } else if (userInput.includes("what is your favorite color")) {
        addMessage("I don’t have a favorite color, but green represents healing in Ayurveda!", 'bot');
        speakText("I don’t have a favorite color, but green represents healing in Ayurveda!");
    } else if (userInput.includes("how do I contact you")) {
        addMessage("You can chat with me anytime through this interface!", 'bot');
        speakText("You can chat with me anytime through this interface!");
    } else if (userInput.includes("do you have a name")) {
        addMessage("You can call me your Ayurvedic assistant!", 'bot');
        speakText("You can call me your Ayurvedic assistant!");
    } else if (userInput.includes("what do you recommend")) {
        addMessage("I recommend a balanced diet based on your dosha. What is yours?", 'bot');
        speakText("I recommend a balanced diet based on your dosha. What is yours?");
    } else if (userInput.includes("can you provide more information")) {
        addMessage("Sure! What topic would you like more information about?", 'bot');
        speakText("Sure! What topic would you like more information about?");
    } else if (userInput.includes("what's your favorite medicine")) {
        addMessage("I don't have favorites, but Ashwagandha is widely appreciated!", 'bot');
        speakText("I don't have favorites, but Ashwagandha is widely appreciated!");
    } else if (userInput.includes("how do I stay fit")) {
        addMessage("Regular yoga and a balanced diet can help you stay fit!", 'bot');
        speakText("Regular yoga and a balanced diet can help you stay fit!");
    } else if (userInput.includes("what's the best way to relax")) {
        addMessage("Meditation and breathing exercises are excellent for relaxation.", 'bot');
        speakText("Meditation and breathing exercises are excellent for relaxation.");
    } else if (userInput.includes("yoga")) {
        addMessage("Yoga is a practice that promotes physical and mental well-being.", 'bot');
        speakText("Yoga is a practice that promotes physical and mental well-being.");
    } else if (userInput.includes("how can I detox")) {
        addMessage("Consider a detox diet with herbal teas and fresh fruits.", 'bot');
        speakText("Consider a detox diet with herbal teas and fresh fruits.");
    } else if (userInput.includes("what herbs are good for health")) {
        addMessage("Turmeric and Ginger are excellent herbs for overall health!", 'bot');
        speakText("Turmeric and Ginger are excellent herbs for overall health!");
    } else if (userInput.includes("what's your recommendation for stress")) {
        addMessage("Practice deep breathing and consider Ashwagandha for stress relief.", 'bot');
        speakText("Practice deep breathing and consider Ashwagandha for stress relief.");
    } else if (userInput.includes("what can I do for digestion")) {
        addMessage("Triphala is often recommended for digestion and gut health.", 'bot');
        speakText("Triphala is often recommended for digestion and gut health.");
    } else if (userInput.includes("tips")) {
        addMessage("Sure! Stay hydrated and eat fresh fruits and vegetables daily.", 'bot');
        speakText("Sure! Stay hydrated and eat fresh fruits and vegetables daily.");
    } else if (userInput.includes("how do I boost immunity")) {
        addMessage("Include foods rich in Vitamin C and herbs like Tulsi in your diet.", 'bot');
        speakText("Include foods rich in Vitamin C and herbs like Tulsi in your diet.");
    } else if (userInput.includes("what's your favorite activity")) {
        addMessage("I enjoy helping users find Ayurvedic solutions!", 'bot');
        speakText("I enjoy helping users find Ayurvedic solutions!");
    } else if (userInput.includes("how can I sleep better")) {
        addMessage("Establish a calming bedtime routine and avoid screens before sleep.", 'bot');
        speakText("Establish a calming bedtime routine and avoid screens before sleep.");
    } else if (userInput.includes("what can help with anxiety")) {
        addMessage("Meditation and herbal teas like Chamomile can help with anxiety.", 'bot');
        speakText("Meditation and herbal teas like Chamomile can help with anxiety.");
    } else if (userInput.includes("what's your source of information")) {
        addMessage("I gather knowledge from traditional Ayurvedic texts and practices.", 'bot');
        speakText("I gather knowledge from traditional Ayurvedic texts and practices.");
    } else if (userInput.includes("tell me about healthy eating")) {
        addMessage("Focus on whole foods and a balanced diet tailored to your dosha.", 'bot');
        speakText("Focus on whole foods and a balanced diet tailored to your dosha.");
    } else if (userInput.includes("how to improve focus")) {
        addMessage("Practice mindfulness and consider Brahmi for improved focus.", 'bot');
        speakText("Practice mindfulness and consider Brahmi for improved focus.");
    } else if (userInput.includes("how do I build muscle")) {
        addMessage("Incorporate protein-rich foods and regular exercise into your routine.", 'bot');
        speakText("Incorporate protein-rich foods and regular exercise into your routine.");
    } else if (userInput.includes("what's your advice for students")) {
        addMessage("Stay organized, and don't forget to take breaks while studying!", 'bot');
        speakText("Stay organized, and don't forget to take breaks while studying!");
    } else if (userInput.includes("what can I do for skin health")) {
        addMessage("Consider applying Aloe Vera and using herbal face packs.", 'bot');
        speakText("Consider applying Aloe Vera and using herbal face packs.");
    } else if (userInput.includes("how can I improve my mood")) {
        addMessage("Engage in activities you love and practice gratitude daily.", 'bot');
        speakText("Engage in activities you love and practice gratitude daily.");
    } else if (userInput.includes("what's the best exercise")) {
        addMessage("Yoga and walking are great exercises for overall health.", 'bot');
        speakText("Yoga and walking are great exercises for overall health.");
    } else if (userInput.includes("can you tell me more about herbs")) {
        addMessage("Sure! Herbs like Ashwagandha and Turmeric are widely used in Ayurveda.", 'bot');
        speakText("Sure! Herbs like Ashwagandha and Turmeric are widely used in Ayurveda.");
    } else if (userInput.includes("what can I do for headaches")) {
        addMessage("Peppermint oil and Ginger tea can help alleviate headaches.", 'bot');
        speakText("Peppermint oil and Ginger tea can help alleviate headaches.");
    } else if (userInput.includes("how can I improve my relationships")) {
        addMessage("Effective communication and empathy are key to healthy relationships.", 'bot');
        speakText("Effective communication and empathy are key to healthy relationships.");
    } else if (userInput.includes("what's your favorite way to relax")) {
        addMessage("Practicing mindfulness and listening to calming music are great ways to relax.", 'bot');
        speakText("Practicing mindfulness and listening to calming music are great ways to relax.");
    } else if (userInput.includes("how can I manage stress")) {
        addMessage("Try yoga and meditation techniques for effective stress management.", 'bot');
        speakText("Try yoga and meditation techniques for effective stress management.");
    }else if (userInput.includes("fever")) {
        addMessage("For fever, Giloy (Guduchi) is recommended. Take 2 spoons before meals, morning and evening.", 'bot');
        speakText("For fever, Giloy (Guduchi) is recommended. Take 2 spoons before meals, morning and evening.");
    } else if (userInput.includes("cold")) {
        addMessage("For a cold, take Tulsi tea with honey twice daily.", 'bot');
        speakText("For a cold, take Tulsi tea with honey twice daily.");
    } else if (userInput.includes("cough")) {
        addMessage("For cough, a mixture of honey and ginger juice is effective. Take 1 teaspoon as needed.", 'bot');
        speakText("For cough, a mixture of honey and ginger juice is effective. Take 1 teaspoon as needed.");
    } else if (userInput.includes("headache")) {
        addMessage("For headaches, try applying a paste of ground mint leaves to your forehead.", 'bot');
        speakText("For headaches, try applying a paste of ground mint leaves to your forehead.");
    } else if (userInput.includes("stomach ache")) {
        addMessage("For stomach aches, ginger tea can help soothe the pain. Drink it warm.", 'bot');
        speakText("For stomach aches, ginger tea can help soothe the pain. Drink it warm.");
    } else if (userInput.includes("nausea")) {
        addMessage("For nausea, try sipping on peppermint tea or chewing on ginger.", 'bot');
        speakText("For nausea, try sipping on peppermint tea or chewing on ginger.");
    } else if (userInput.includes("diabetes")) {
        addMessage("For diabetes, incorporate bitter gourd (Karela) juice into your diet. Take 30ml daily.", 'bot');
        speakText("For diabetes, incorporate bitter gourd (Karela) juice into your diet. Take 30ml daily.");
    } else if (userInput.includes("anxiety")) {
        addMessage("For anxiety, Ashwagandha is beneficial. Take 1 teaspoon of powder mixed with warm milk before bed.", 'bot');
        speakText("For anxiety, Ashwagandha is beneficial. Take 1 teaspoon of powder mixed with warm milk before bed.");
    } else if (userInput.includes("insomnia")) {
        addMessage("For insomnia, try drinking warm milk with a pinch of nutmeg before bedtime.", 'bot');
        speakText("For insomnia, try drinking warm milk with a pinch of nutmeg before bedtime.");
    } else if (userInput.includes("acidity")) {
        addMessage("For acidity, mix 1 teaspoon of baking soda in a glass of water and drink it.", 'bot');
        speakText("For acidity, mix 1 teaspoon of baking soda in a glass of water and drink it.");
    } else if (userInput.includes("constipation")) {
        addMessage("For constipation, consume Triphala at night with warm water.", 'bot');
        speakText("For constipation, consume Triphala at night with warm water.");
    } else if (userInput.includes("high blood pressure")) {
        addMessage("For high blood pressure, regular consumption of garlic can be beneficial.", 'bot');
        speakText("For high blood pressure, regular consumption of garlic can be beneficial.");
    } else if (userInput.includes("skin rash")) {
        addMessage("For skin rashes, apply a paste of neem leaves on the affected area.", 'bot');
        speakText("For skin rashes, apply a paste of neem leaves on the affected area.");
    } else if (userInput.includes("eczema")) {
        addMessage("For eczema, use a paste of turmeric and coconut oil on the affected skin.", 'bot');
        speakText("For eczema, use a paste of turmeric and coconut oil on the affected skin.");
    } else if (userInput.includes("acne")) {
        addMessage("For acne, apply a mixture of honey and cinnamon on the affected areas.", 'bot');
        speakText("For acne, apply a mixture of honey and cinnamon on the affected areas.");
    } else if (userInput.includes("allergies")) {
        addMessage("For allergies, consume Tulsi leaves or Tulsi tea for relief.", 'bot');
        speakText("For allergies, consume Tulsi leaves or Tulsi tea for relief.");
    } else if (userInput.includes("arthritis")) {
        addMessage("For arthritis, a mixture of warm olive oil and turmeric can be massaged onto the joints.", 'bot');
        speakText("For arthritis, a mixture of warm olive oil and turmeric can be massaged onto the joints.");
    } else if (userInput.includes("fatigue")) {
        addMessage("For fatigue, try Ashwagandha root powder with milk in the morning.", 'bot');
        speakText("For fatigue, try Ashwagandha root powder with milk in the morning.");
    } else if (userInput.includes("feeling weak")) {
        addMessage("For weakness, consume a mix of almonds and dried figs soaked in water overnight.", 'bot');
        speakText("For weakness, consume a mix of almonds and dried figs soaked in water overnight.");
    } else if (userInput.includes("hair fall")) {
        addMessage("For hair fall, massage your scalp with coconut oil mixed with curry leaves.", 'bot');
        speakText("For hair fall, massage your scalp with coconut oil mixed with curry leaves.");
    } else if (userInput.includes("dandruff")) {
        addMessage("For dandruff, apply a paste of neem leaves to the scalp and wash off after 30 minutes.", 'bot');
        speakText("For dandruff, apply a paste of neem leaves to the scalp and wash off after 30 minutes.");
    } else if (userInput.includes("cold sore")) {
        addMessage("For cold sores, apply a mixture of honey and tea tree oil on the affected area.", 'bot');
        speakText("For cold sores, apply a mixture of honey and tea tree oil on the affected area.");
    } else if (userInput.includes("kidney stones")) {
        addMessage("For kidney stones, drink plenty of water and consume pomegranate juice.", 'bot');
        speakText("For kidney stones, drink plenty of water and consume pomegranate juice.");
    } else if (userInput.includes("indigestion")) {
        addMessage("For indigestion, take a teaspoon of fennel seeds after meals.", 'bot');
        speakText("For indigestion, take a teaspoon of fennel seeds after meals.");
    } else if (userInput.includes("gout")) {
        addMessage("For gout, increase water intake and consume cherry juice regularly.", 'bot');
        speakText("For gout, increase water intake and consume cherry juice regularly.");
    } else if (userInput.includes("pneumonia")) {
        addMessage("For pneumonia, drink warm water with honey and ginger.", 'bot');
        speakText("For pneumonia, drink warm water with honey and ginger.");
    } else if (userInput.includes("asthma")) {
        addMessage("For asthma, drink warm water with turmeric and honey.", 'bot');
        speakText("For asthma, drink warm water with turmeric and honey.");
    } else if (userInput.includes("migraine")) {
        addMessage("For migraines, try a cold compress on your forehead.", 'bot');
        speakText("For migraines, try a cold compress on your forehead.");
    } else if (userInput.includes("back pain")) {
        addMessage("For back pain, apply a warm compress and consider a gentle massage with mustard oil.", 'bot');
        speakText("For back pain, apply a warm compress and consider a gentle massage with mustard oil.");
    } else if (userInput.includes("sore throat")) {
        addMessage("For sore throat, gargle with warm salt water and drink ginger tea.", 'bot');
        speakText("For sore throat, gargle with warm salt water and drink ginger tea.");
    } else if (userInput.includes("fatty liver")) {
        addMessage("For fatty liver, drink dandelion tea regularly to support liver health.", 'bot');
        speakText("For fatty liver, drink dandelion tea regularly to support liver health.");
    } else if (userInput.includes("hyperacidity")) {
        addMessage("For hyperacidity, consume coconut water to soothe the stomach.", 'bot');
        speakText("For hyperacidity, consume coconut water to soothe the stomach.");
    } else if (userInput.includes("bloating")) {
        addMessage("For bloating, drink ginger tea or chew on cumin seeds.", 'bot');
        speakText("For bloating, drink ginger tea or chew on cumin seeds.");
    } else if (userInput.includes("ulcer")) {
        addMessage("For ulcers, consume aloe vera juice daily.", 'bot');
        speakText("For ulcers, consume aloe vera juice daily.");
    } else if (userInput.includes("psoriasis")) {
        addMessage("For psoriasis, apply a mixture of coconut oil and turmeric to the skin.", 'bot');
        speakText("For psoriasis, apply a mixture of coconut oil and turmeric to the skin.");
    } else if (userInput.includes("scabies")) {
        addMessage("For scabies, a paste of neem leaves can be applied to the affected area.", 'bot');
        speakText("For scabies, a paste of neem leaves can be applied to the affected area.");
    } else if (userInput.includes("hepatitis")) {
        addMessage("For hepatitis, drink fresh beetroot juice daily.", 'bot');
        speakText("For hepatitis, drink fresh beetroot juice daily.");
    } else if (userInput.includes("dysentery")) {
        addMessage("For dysentery, drink pomegranate juice or a decoction of rice water.", 'bot');
        speakText("For dysentery, drink pomegranate juice or a decoction of rice water.");
    } else if (userInput.includes("cholesterol")) {
        addMessage("For high cholesterol, include flaxseeds in your diet.", 'bot');
        speakText("For high cholesterol, include flaxseeds in your diet.");
    } else if (userInput.includes("constipation")) {
        addMessage("For constipation, eat soaked dried figs every morning.", 'bot');
        speakText("For constipation, eat soaked dried figs every morning.");
    } else if (userInput.includes("mouth ulcers")) {
        addMessage("For mouth ulcers, gargle with coconut oil and salt water.", 'bot');
        speakText("For mouth ulcers, gargle with coconut oil and salt water.");
    } else if (userInput.includes("tuberculosis")) {
        addMessage("For tuberculosis, include honey and turmeric in your diet.", 'bot');
        speakText("For tuberculosis, include honey and turmeric in your diet.");
    } else if (userInput.includes("varicose veins")) {
        addMessage("For varicose veins, elevate your legs and consider horse chestnut supplements.", 'bot');
        speakText("For varicose veins, elevate your legs and consider horse chestnut supplements.");
    } else if (userInput.includes("sciatica")) {
        addMessage("For sciatica, apply a paste of turmeric and warm mustard oil on the lower back.", 'bot');
        speakText("For sciatica, apply a paste of turmeric and warm mustard oil on the lower back.");
    } else if (userInput.includes("sore muscles")) {
        addMessage("For sore muscles, consider a hot Epsom salt bath.", 'bot');
        speakText("For sore muscles, consider a hot Epsom salt bath.");
    } else if (userInput.includes("tinnitus")) {
        addMessage("For tinnitus, practice yoga and meditation for relaxation.", 'bot');
        speakText("For tinnitus, practice yoga and meditation for relaxation.");
    } else if (userInput.includes("vitiligo")) {
        addMessage("For vitiligo, apply a mixture of ginger juice and honey to the affected areas.", 'bot');
        speakText("For vitiligo, apply a mixture of ginger juice and honey to the affected areas.");
    } else if (userInput.includes("tremors")) {
        addMessage("For tremors, consider Brahmi and practice stress-reducing techniques.", 'bot');
        speakText("For tremors, consider Brahmi and practice stress-reducing techniques.");
    } else if (userInput.includes("hemorrhoids")) {
        addMessage("For hemorrhoids, consume high-fiber foods and drink plenty of water.", 'bot');
        speakText("For hemorrhoids, consume high-fiber foods and drink plenty of water.");
    } else if (userInput.includes("neurosis")) {
        addMessage("For neurosis, herbal teas like chamomile can help calm the mind.", 'bot');
        speakText("For neurosis, herbal teas like chamomile can help calm the mind.");
    } else if (userInput.includes("thyroid")) {
        addMessage("For thyroid issues, consume seaweed or ashwagandha as directed.", 'bot');
        speakText("For thyroid issues, consume seaweed or ashwagandha as directed.");
    } else if (userInput.includes("gallstones")) {
        addMessage("For gallstones, drink apple juice daily to soften the stones.", 'bot');
        speakText("For gallstones, drink apple juice daily to soften the stones.");
    } else if (userInput.includes("diverticulitis")) {
        addMessage("For diverticulitis, eat a high-fiber diet and drink plenty of fluids.", 'bot');
        speakText("For diverticulitis, eat a high-fiber diet and drink plenty of fluids.");
    } else if (userInput.includes("chronic fatigue")) {
        addMessage("For chronic fatigue, include B-complex vitamins in your diet.", 'bot');
        speakText("For chronic fatigue, include B-complex vitamins in your diet.");
    } else if (userInput.includes("hyperthyroidism")) {
        addMessage("For hyperthyroidism, avoid excessive intake of caffeine and spicy foods.", 'bot');
        speakText("For hyperthyroidism, avoid excessive intake of caffeine and spicy foods.");
    } else if (userInput.includes("obesity")) {
        addMessage("For obesity, practice yoga and consume a balanced, low-calorie diet.", 'bot');
        speakText("For obesity, practice yoga and consume a balanced, low-calorie diet.");
    } else if (userInput.includes("chronic bronchitis")) {
        addMessage("For chronic bronchitis, consume warm herbal teas and avoid cold drinks.", 'bot');
        speakText("For chronic bronchitis, consume warm herbal teas and avoid cold drinks.");
    } else if (userInput.includes("depression")) {
        addMessage("For depression, engage in regular exercise and consider St. John's Wort.", 'bot');
        speakText("For depression, engage in regular exercise and consider St. John's Wort.");
    } else if (userInput.includes("chronic pain")) {
        addMessage("For chronic pain, consider turmeric supplements and acupuncture.", 'bot');
        speakText("For chronic pain, consider turmeric supplements and acupuncture.");
    } else if (userInput.includes("hormonal imbalance")) {
        addMessage("For hormonal imbalance, consume flaxseeds and adaptogen herbs.", 'bot');
        speakText("For hormonal imbalance, consume flaxseeds and adaptogen herbs.");
    } else if (userInput.includes("chronic sinusitis")) {
        addMessage("For chronic sinusitis, steam inhalation with eucalyptus oil can help.", 'bot');
        speakText("For chronic sinusitis, steam inhalation with eucalyptus oil can help.");
    } else if (userInput.includes("early menopause")) {
        addMessage("For early menopause, include phytoestrogen-rich foods like soy in your diet.", 'bot');
        speakText("For early menopause, include phytoestrogen-rich foods like soy in your diet.");
    } else if (userInput.includes("kidney infection")) {
        addMessage("For kidney infections, drink cranberry juice regularly.", 'bot');
        speakText("For kidney infections, drink cranberry juice regularly.");
    } else if (userInput.includes("urticaria")) {
        addMessage("For urticaria, consume antihistamine herbs like nettle and stay hydrated.", 'bot');
        speakText("For urticaria, consume antihistamine herbs like nettle and stay hydrated.");
    } else if (userInput.includes("fatigue syndrome")) {
        addMessage("For fatigue syndrome, ensure adequate sleep and consider vitamin B12 supplementation.", 'bot');
        speakText("For fatigue syndrome, ensure adequate sleep and consider vitamin B12 supplementation.");
    } else if (userInput.includes("sore eyes")) {
        addMessage("For sore eyes, wash them with rose water to soothe irritation.", 'bot');
        speakText("For sore eyes, wash them with rose water to soothe irritation.");
    } else if (userInput.includes("hemophilia")) {
        addMessage("For hemophilia, maintain a healthy diet rich in green leafy vegetables.", 'bot');
        speakText("For hemophilia, maintain a healthy diet rich in green leafy vegetables.");
    } else if (userInput.includes("scleroderma")) {
        addMessage("For scleroderma, consider consuming omega-3 fatty acids from fish oil.", 'bot');
        speakText("For scleroderma, consider consuming omega-3 fatty acids from fish oil.");
    } else if (userInput.includes("palsy")) {
        addMessage("For palsy, practice gentle yoga and physiotherapy.", 'bot');
        speakText("For palsy, practice gentle yoga and physiotherapy.");
    } else if (userInput.includes("multiple sclerosis")) {
        addMessage("For multiple sclerosis, consider a diet rich in antioxidants.", 'bot');
        speakText("For multiple sclerosis, consider a diet rich in antioxidants.");
    } else if (userInput.includes("neuropathy")) {
        addMessage("For neuropathy, B-complex vitamins and regular exercise can help.", 'bot');
        speakText("For neuropathy, B-complex vitamins and regular exercise can help.");
    } else if (userInput.includes("chronic fatigue syndrome")) {
        addMessage("For chronic fatigue syndrome, focus on sleep hygiene and stress management techniques.", 'bot');
        speakText("For chronic fatigue syndrome, focus on sleep hygiene and stress management techniques.");
    }else if (userInput.includes("fever")) {
        addMessage("For fever, take 2 teaspoons of Giloy (Guduchi) in the morning and evening before meals.", 'bot');
        speakText("For fever, take 2 teaspoons of Giloy (Guduchi) in the morning and evening before meals.");
    } else if (userInput.includes("cold")) {
        addMessage("For a cold, drink Tulsi tea with honey, 1-2 cups daily.", 'bot');
        speakText("For a cold, drink Tulsi tea with honey, 1-2 cups daily.");
    } else if (userInput.includes("cough")) {
        addMessage("For cough, take 1 teaspoon of honey mixed with 1/2 teaspoon of ginger juice, twice a day.", 'bot');
        speakText("For cough, take 1 teaspoon of honey mixed with 1/2 teaspoon of ginger juice, twice a day.");
    } else if (userInput.includes("headache")) {
        addMessage("For headaches, apply a paste of ground mint leaves to your forehead for 30 minutes.", 'bot');
        speakText("For headaches, apply a paste of ground mint leaves to your forehead for 30 minutes.");
    } else if (userInput.includes("stomach ache")) {
        addMessage("For stomach aches, drink 1 cup of ginger tea after meals.", 'bot');
        speakText("For stomach aches, drink 1 cup of ginger tea after meals.");
    } else if (userInput.includes("nausea")) {
        addMessage("For nausea, take 1-2 pieces of ginger or sip on ginger tea as needed.", 'bot');
        speakText("For nausea, take 1-2 pieces of ginger or sip on ginger tea as needed.");
    } else if (userInput.includes("diabetes")) {
        addMessage("For diabetes, drink 30ml of bitter gourd (Karela) juice on an empty stomach daily.", 'bot');
        speakText("For diabetes, drink 30ml of bitter gourd (Karela) juice on an empty stomach daily.");
    } else if (userInput.includes("anxiety")) {
        addMessage("For anxiety, take 1 teaspoon of Ashwagandha powder with warm milk before bedtime.", 'bot');
        speakText("For anxiety, take 1 teaspoon of Ashwagandha powder with warm milk before bedtime.");
    } else if (userInput.includes("insomnia")) {
        addMessage("For insomnia, drink 1 cup of warm milk with a pinch of nutmeg before bed.", 'bot');
        speakText("For insomnia, drink 1 cup of warm milk with a pinch of nutmeg before bed.");
    } else if (userInput.includes("acidity")) {
        addMessage("For acidity, mix 1 teaspoon of baking soda in a glass of water and drink it after meals.", 'bot');
        speakText("For acidity, mix 1 teaspoon of baking soda in a glass of water and drink it after meals.");
    } else if (userInput.includes("constipation")) {
        addMessage("For constipation, take 1 teaspoon of Triphala with warm water before bedtime.", 'bot');
        speakText("For constipation, take 1 teaspoon of Triphala with warm water before bedtime.");
    } else if (userInput.includes("high blood pressure")) {
        addMessage("For high blood pressure, consume 1-2 cloves of garlic daily.", 'bot');
        speakText("For high blood pressure, consume 1-2 cloves of garlic daily.");
    } else if (userInput.includes("skin rash")) {
        addMessage("For skin rashes, apply a paste of neem leaves on the affected area twice a day.", 'bot');
        speakText("For skin rashes, apply a paste of neem leaves on the affected area twice a day.");
    } else if (userInput.includes("eczema")) {
        addMessage("For eczema, apply a paste of 1 teaspoon turmeric and 2 teaspoons coconut oil on the skin once daily.", 'bot');
        speakText("For eczema, apply a paste of 1 teaspoon turmeric and 2 teaspoons coconut oil on the skin once daily.");
    } else if (userInput.includes("acne")) {
        addMessage("For acne, apply a mixture of 1 tablespoon honey and 1/2 teaspoon cinnamon to the affected areas once daily.", 'bot');
        speakText("For acne, apply a mixture of 1 tablespoon honey and 1/2 teaspoon cinnamon to the affected areas once daily.");
    } else if (userInput.includes("allergies")) {
        addMessage("For allergies, chew 5-7 Tulsi leaves daily for relief.", 'bot');
        speakText("For allergies, chew 5-7 Tulsi leaves daily for relief.");
    } else if (userInput.includes("arthritis")) {
        addMessage("For arthritis, massage the joints with a mixture of 1 tablespoon warm olive oil and 1/2 teaspoon turmeric twice daily.", 'bot');
        speakText("For arthritis, massage the joints with a mixture of 1 tablespoon warm olive oil and 1/2 teaspoon turmeric twice daily.");
    } else if (userInput.includes("fatigue")) {
        addMessage("For fatigue, take 1 teaspoon of Ashwagandha with milk every morning.", 'bot');
        speakText("For fatigue, take 1 teaspoon of Ashwagandha with milk every morning.");
    } else if (userInput.includes("feeling weak")) {
        addMessage("For weakness, consume 3-4 soaked almonds and dried figs daily.", 'bot');
        speakText("For weakness, consume 3-4 soaked almonds and dried figs daily.");
    } else if (userInput.includes("hair fall")) {
        addMessage("For hair fall, massage your scalp with 2 tablespoons coconut oil mixed with 5-6 curry leaves weekly.", 'bot');
        speakText("For hair fall, massage your scalp with 2 tablespoons coconut oil mixed with 5-6 curry leaves weekly.");
    } else if (userInput.includes("dandruff")) {
        addMessage("For dandruff, apply a paste of neem leaves to the scalp and wash off after 30 minutes, twice a week.", 'bot');
        speakText("For dandruff, apply a paste of neem leaves to the scalp and wash off after 30 minutes, twice a week.");
    } else if (userInput.includes("cold sore")) {
        addMessage("For cold sores, apply a mixture of 1 teaspoon honey and 2 drops of tea tree oil on the affected area, 2-3 times a day.", 'bot');
        speakText("For cold sores, apply a mixture of 1 teaspoon honey and 2 drops of tea tree oil on the affected area, 2-3 times a day.");
    } else if (userInput.includes("kidney stones")) {
        addMessage("For kidney stones, drink 1 glass of pomegranate juice daily.", 'bot');
        speakText("For kidney stones, drink 1 glass of pomegranate juice daily.");
    } else if (userInput.includes("indigestion")) {
        addMessage("For indigestion, take 1 teaspoon of fennel seeds after meals, 2-3 times a day.", 'bot');
        speakText("For indigestion, take 1 teaspoon of fennel seeds after meals, 2-3 times a day.");
    } else if (userInput.includes("gout")) {
        addMessage("For gout, drink 1 cup of cherry juice daily.", 'bot');
        speakText("For gout, drink 1 cup of cherry juice daily.");
    } else if (userInput.includes("pneumonia")) {
        addMessage("For pneumonia, drink 2 cups of warm water with honey and ginger daily.", 'bot');
        speakText("For pneumonia, drink 2 cups of warm water with honey and ginger daily.");
    } else if (userInput.includes("asthma")) {
        addMessage("For asthma, drink 1 cup of warm water with 1 teaspoon turmeric and 1 tablespoon honey daily.", 'bot');
        speakText("For asthma, drink 1 cup of warm water with 1 teaspoon turmeric and 1 tablespoon honey daily.");
    } else if (userInput.includes("migraine")) {
        addMessage("For migraines, apply a cold compress for 30 minutes and consider drinking peppermint tea.", 'bot');
        speakText("For migraines, apply a cold compress for 30 minutes and consider drinking peppermint tea.");
    } else if (userInput.includes("back pain")) {
        addMessage("For back pain, apply a warm compress with mustard oil for 30 minutes daily.", 'bot');
        speakText("For back pain, apply a warm compress with mustard oil for 30 minutes daily.");
    } else if (userInput.includes("sore throat")) {
        addMessage("For sore throat, gargle with 1 cup of warm salt water twice a day and drink ginger tea.", 'bot');
        speakText("For sore throat, gargle with 1 cup of warm salt water twice a day and drink ginger tea.");
    } else if (userInput.includes("fatty liver")) {
        addMessage("For fatty liver, drink 30ml of dandelion tea daily.", 'bot');
        speakText("For fatty liver, drink 30ml of dandelion tea daily.");
    } else if (userInput.includes("hyperacidity")) {
        addMessage("For hyperacidity, drink 1 glass of coconut water after meals.", 'bot');
        speakText("For hyperacidity, drink 1 glass of coconut water after meals.");
    } else if (userInput.includes("bloating")) {
        addMessage("For bloating, drink ginger tea after meals, 1-2 cups daily.", 'bot');
        speakText("For bloating, drink ginger tea after meals, 1-2 cups daily.");
    } else if (userInput.includes("irregular periods")) {
        addMessage("For irregular periods, take 1 teaspoon of fennel seeds in warm water daily.", 'bot');
        speakText("For irregular periods, take 1 teaspoon of fennel seeds in warm water daily.");
    } else if (userInput.includes("menstrual cramps")) {
        addMessage("For menstrual cramps, drink chamomile tea 1-2 times a day during your period.", 'bot');
        speakText("For menstrual cramps, drink chamomile tea 1-2 times a day during your period.");
    } else if (userInput.includes("high uric acid")) {
        addMessage("For high uric acid, consume 1 cup of dandelion tea daily.", 'bot');
        speakText("For high uric acid, consume 1 cup of dandelion tea daily.");
    } else if (userInput.includes("tension headache")) {
        addMessage("For tension headaches, drink 1 cup of peppermint tea and rest in a quiet place.", 'bot');
        speakText("For tension headaches, drink 1 cup of peppermint tea and rest in a quiet place.");
    } else if (userInput.includes("hives")) {
        addMessage("For hives, take 1 teaspoon of honey mixed with lemon juice, 2-3 times a day.", 'bot');
        speakText("For hives, take 1 teaspoon of honey mixed with lemon juice, 2-3 times a day.");
    } else if (userInput.includes("thyroid issues")) {
        addMessage("For thyroid issues, take 1-2 teaspoons of ashwagandha daily.", 'bot');
        speakText("For thyroid issues, take 1-2 teaspoons of ashwagandha daily.");
    } else if (userInput.includes("brittle nails")) {
        addMessage("For brittle nails, consume biotin-rich foods and take 1 tablespoon of olive oil weekly.", 'bot');
        speakText("For brittle nails, consume biotin-rich foods and take 1 tablespoon of olive oil weekly.");
    } else if (userInput.includes("varicose veins")) {
        addMessage("For varicose veins, elevate your legs and consume 1 tablespoon of horse chestnut extract daily.", 'bot');
        speakText("For varicose veins, elevate your legs and consume 1 tablespoon of horse chestnut extract daily.");
    } else if (userInput.includes("frequent colds")) {
        addMessage("For frequent colds, take 1 teaspoon of honey with a pinch of turmeric daily.", 'bot');
        speakText("For frequent colds, take 1 teaspoon of honey with a pinch of turmeric daily.");
    } else if (userInput.includes("high cholesterol")) {
        addMessage("For high cholesterol, consume 1 tablespoon of flaxseeds daily.", 'bot');
        speakText("For high cholesterol, consume 1 tablespoon of flaxseeds daily.");
    } else if (userInput.includes("high blood sugar")) {
        addMessage("For high blood sugar, take 1 tablespoon of cinnamon powder mixed in water daily.", 'bot');
        speakText("For high blood sugar, take 1 tablespoon of cinnamon powder mixed in water daily.");
    } else if (userInput.includes("digestive issues")) {
        addMessage("For digestive issues, take 1 teaspoon of Ajwain (carom seeds) after meals, 2-3 times a day.", 'bot');
        speakText("For digestive issues, take 1 teaspoon of Ajwain (carom seeds) after meals, 2-3 times a day.");
    } else if (userInput.includes("fatigue syndrome")) {
        addMessage("For fatigue syndrome, ensure 8 hours of sleep and consume adaptogenic herbs like Ashwagandha.", 'bot');
        speakText("For fatigue syndrome, ensure 8 hours of sleep and consume adaptogenic herbs like Ashwagandha.");
    }else if (userInput.includes("fever")) {
    addMessage("For fever, drink 1 cup of hot ginger tea, 2-3 times a day.", 'bot');
    speakText("For fever, drink 1 cup of hot ginger tea, 2-3 times a day.");
} else if (userInput.includes("cold")) {
    addMessage("For a cold, mix 1 teaspoon of turmeric in warm milk and drink it twice a day.", 'bot');
    speakText("For a cold, mix 1 teaspoon of turmeric in warm milk and drink it twice a day.");
} else if (userInput.includes("cough")) {
    addMessage("For cough, take 1 tablespoon of honey mixed with 1/4 teaspoon of cinnamon powder before bed.", 'bot');
    speakText("For cough, take 1 tablespoon of honey mixed with 1/4 teaspoon of cinnamon powder before bed.");
} else if (userInput.includes("headache")) {
    addMessage("For headaches, inhale steam mixed with eucalyptus oil 2-3 times a day.", 'bot');
    speakText("For headaches, inhale steam mixed with eucalyptus oil 2-3 times a day.");
} else if (userInput.includes("stomach ache")) {
    addMessage("For stomach aches, drink warm ginger tea with a pinch of salt.", 'bot');
    speakText("For stomach aches, drink warm ginger tea with a pinch of salt.");
} else if (userInput.includes("nausea")) {
    addMessage("For nausea, chew on a small piece of mint leaves or drink peppermint tea.", 'bot');
    speakText("For nausea, chew on a small piece of mint leaves or drink peppermint tea.");
} 
 else if (userInput.includes("anxiety")) {
    addMessage("For anxiety, drink 1 cup of chamomile tea in the evening.", 'bot');
    speakText("For anxiety, drink 1 cup of chamomile tea in the evening.");
} else if (userInput.includes("insomnia")) {
    addMessage("For insomnia, take 1/2 teaspoon of Ashwagandha powder with warm milk at night.", 'bot');
    speakText("For insomnia, take 1/2 teaspoon of Ashwagandha powder with warm milk at night.");
} else if (userInput.includes("acidity")) {
    addMessage("For acidity, drink 1 cup of coconut water daily.", 'bot');
    speakText("For acidity, drink 1 cup of coconut water daily.");
} else if (userInput.includes("constipation")) {
    addMessage("For constipation, eat 2-3 figs every morning.", 'bot');
    speakText("For constipation, eat 2-3 figs every morning.");
} else if (userInput.includes("high blood pressure")) {
    addMessage("For high blood pressure, drink 1 cup of carrot juice daily.", 'bot');
    speakText("For high blood pressure, drink 1 cup of carrot juice daily.");
} else if (userInput.includes("skin rash")) {
    addMessage("For skin rashes, apply a paste of neem leaves and water on the affected area.", 'bot');
    speakText("For skin rashes, apply a paste of neem leaves and water on the affected area.");
} else if (userInput.includes("eczema")) {
    addMessage("For eczema, apply a mixture of olive oil and shea butter on the affected skin.", 'bot');
    speakText("For eczema, apply a mixture of olive oil and shea butter on the affected skin.");
} else if (userInput.includes("acne")) {
    addMessage("For acne, apply a paste of ground neem leaves with water directly on the spots.", 'bot');
    speakText("For acne, apply a paste of ground neem leaves with water directly on the spots.");
} else if (userInput.includes("allergies")) {
    addMessage("For allergies, take 1 teaspoon of turmeric mixed with warm milk daily.", 'bot');
    speakText("For allergies, take 1 teaspoon of turmeric mixed with warm milk daily.");
} else if (userInput.includes("arthritis")) {
    addMessage("For arthritis, drink 1 cup of warm water with 1 teaspoon of ginger powder every morning.", 'bot');
    speakText("For arthritis, drink 1 cup of warm water with 1 teaspoon of ginger powder every morning.");
} else if (userInput.includes("fatigue")) {
    addMessage("For fatigue, consume a handful of nuts daily for energy.", 'bot');
    speakText("For fatigue, consume a handful of nuts daily for energy.");
} else if (userInput.includes("feeling weak")) {
    addMessage("For weakness, take 1 tablespoon of honey mixed with a pinch of turmeric every morning.", 'bot');
    speakText("For weakness, take 1 tablespoon of honey mixed with a pinch of turmeric every morning.");
} else if (userInput.includes("hair fall")) {
    addMessage("For hair fall, massage your scalp with coconut oil once a week.", 'bot');
    speakText("For hair fall, massage your scalp with coconut oil once a week.");
} else if (userInput.includes("dandruff")) {
    addMessage("For dandruff, mix 1 tablespoon of lemon juice with 2 tablespoons of yogurt and apply on the scalp.", 'bot');
    speakText("For dandruff, mix 1 tablespoon of lemon juice with 2 tablespoons of yogurt and apply on the scalp.");
} else if (userInput.includes("cold sore")) {
    addMessage("For cold sores, apply a mixture of honey and tea tree oil on the affected area.", 'bot');
    speakText("For cold sores, apply a mixture of honey and tea tree oil on the affected area.");
} else if (userInput.includes("kidney stones")) {
    addMessage("For kidney stones, drink 2-3 liters of water daily and include lemon juice.", 'bot');
    speakText("For kidney stones, drink 2-3 liters of water daily and include lemon juice.");
} else if (userInput.includes("indigestion")) {
    addMessage("For indigestion, consume 1 teaspoon of ajwain (carom seeds) with warm water after meals.", 'bot');
    speakText("For indigestion, consume 1 teaspoon of ajwain (carom seeds) with warm water after meals.");
} else if (userInput.includes("gout")) {
    addMessage("For gout, drink 1 cup of warm water mixed with 1 tablespoon of lemon juice.", 'bot');
    speakText("For gout, drink 1 cup of warm water mixed with 1 tablespoon of lemon juice.");
} else if (userInput.includes("pneumonia")) {
    addMessage("For pneumonia, consume 1 teaspoon of honey mixed with black pepper twice a day.", 'bot');
    speakText("For pneumonia, consume 1 teaspoon of honey mixed with black pepper twice a day.");
} else if (userInput.includes("asthma")) {
    addMessage("For asthma, take 1 teaspoon of honey with a pinch of black pepper daily.", 'bot');
    speakText("For asthma, take 1 teaspoon of honey with a pinch of black pepper daily.");
} else if (userInput.includes("migraine")) {
    addMessage("For migraines, apply peppermint oil on the temples for relief.", 'bot');
    speakText("For migraines, apply peppermint oil on the temples for relief.");
} else if (userInput.includes("back pain")) {
    addMessage("For back pain, apply warm mustard oil with a pinch of salt on the affected area.", 'bot');
    speakText("For back pain, apply warm mustard oil with a pinch of salt on the affected area.");
} else if (userInput.includes("sore throat")) {
    addMessage("For sore throat, gargle with warm salt water 2-3 times a day.", 'bot');
    speakText("For sore throat, gargle with warm salt water 2-3 times a day.");
} else if (userInput.includes("fatty liver")) {
    addMessage("For fatty liver, drink 1 cup of warm water with 1 teaspoon of honey and lemon daily.", 'bot');
    speakText("For fatty liver, drink 1 cup of warm water with 1 teaspoon of honey and lemon daily.");
} else if (userInput.includes("bloating")) {
    addMessage("For bloating, drink warm water infused with 1 teaspoon of fennel seeds after meals.", 'bot');
    speakText("For bloating, drink warm water infused with 1 teaspoon of fennel seeds after meals.");
} else if (userInput.includes("irregular periods")) {
    addMessage("For irregular periods, consume 1 cup of fennel tea daily.", 'bot');
    speakText("For irregular periods, consume 1 cup of fennel tea daily.");
} else if (userInput.includes("menstrual cramps")) {
    addMessage("For menstrual cramps, drink ginger tea with a teaspoon of honey for relief.", 'bot');
    speakText("For menstrual cramps, drink ginger tea with a teaspoon of honey for relief.");
} else if (userInput.includes("hormonal imbalance")) {
    addMessage("For hormonal imbalance, consume 1 tablespoon of flaxseeds daily.", 'bot');
    speakText("For hormonal imbalance, consume 1 tablespoon of flaxseeds daily.");
} else if (userInput.includes("cholesterol")) {
    addMessage("For high cholesterol, consume 1 tablespoon of flaxseed oil daily.", 'bot');
    speakText("For high cholesterol, consume 1 tablespoon of flaxseed oil daily.");
} else if (userInput.includes("osteoporosis")) {
    addMessage("For osteoporosis, consume 1 glass of milk with 1 teaspoon of sesame seeds daily.", 'bot');
    speakText("For osteoporosis, consume 1 glass of milk with 1 teaspoon of sesame seeds daily.");
} else if (userInput.includes("hemorrhoids")) {
    addMessage("For hemorrhoids, consume 1 tablespoon of psyllium husk with warm water daily.", 'bot');
    speakText("For hemorrhoids, consume 1 tablespoon of psyllium husk with warm water daily.");
} else if (userInput.includes("jaundice")) {
    addMessage("For jaundice, drink 1 glass of fresh lemon juice daily.", 'bot');
    speakText("For jaundice, drink 1 glass of fresh lemon juice daily.");
} else if (userInput.includes("sciatica")) {
    addMessage("For sciatica, apply a warm compress on the lower back and legs.", 'bot');
    speakText("For sciatica, apply a warm compress on the lower back and legs.");
} else if (userInput.includes("anemia")) {
    addMessage("For anemia, consume 1 cup of pomegranate juice daily.", 'bot');
    speakText("For anemia, consume 1 cup of pomegranate juice daily.");
} else if (userInput.includes("tinnitus")) {
    addMessage("For tinnitus, drink 1 cup of warm water with 1 teaspoon of honey daily.", 'bot');
    speakText("For tinnitus, drink 1 cup of warm water with 1 teaspoon of honey daily.");
} else if (userInput.includes("ear infection")) {
    addMessage("For ear infections, apply warm garlic oil in the ear for relief.", 'bot');
    speakText("For ear infections, apply warm garlic oil in the ear for relief.");
} else if (userInput.includes("cystitis")) {
    addMessage("For cystitis, drink 2-3 cups of cranberry juice daily.", 'bot');
    speakText("For cystitis, drink 2-3 cups of cranberry juice daily.");
} else if (userInput.includes("thrush")) {
    addMessage("For thrush, mix 1 tablespoon of coconut oil with a few drops of tea tree oil and apply.", 'bot');
    speakText("For thrush, mix 1 tablespoon of coconut oil with a few drops of tea tree oil and apply.");
} else if (userInput.includes("bacterial infection")) {
    addMessage("For bacterial infections, take 1 tablespoon of honey with garlic daily.", 'bot');
    speakText("For bacterial infections, take 1 tablespoon of honey with garlic daily.");
} else if (userInput.includes("viral infection")) {
    addMessage("For viral infections, consume 1 teaspoon of ginger juice with honey twice a day.", 'bot');
    speakText("For viral infections, consume 1 teaspoon of ginger juice with honey twice a day.");
} else if (userInput.includes("asthma")) {
    addMessage("For asthma, consume 1 tablespoon of honey with a pinch of turmeric daily.", 'bot');
    speakText("For asthma, consume 1 tablespoon of honey with a pinch of turmeric daily.");
} else if (userInput.includes("cancer prevention")) {
    addMessage("For cancer prevention, consume a diet rich in fruits and vegetables daily.", 'bot');
    speakText("For cancer prevention, consume a diet rich in fruits and vegetables daily.");
} else if (userInput.includes("gallbladder issues")) {
    addMessage("For gallbladder issues, drink 1 cup of warm water with lemon juice every morning.", 'bot');
    speakText("For gallbladder issues, drink 1 cup of warm water with lemon juice every morning.");
} else if (userInput.includes("tuberculosis")) {
    addMessage("For tuberculosis, consume 1 cup of warm milk with a pinch of turmeric daily.", 'bot');
    speakText("For tuberculosis, consume 1 cup of warm milk with a pinch of turmeric daily.");
} else if (userInput.includes("hives")) {
    addMessage("For hives, take 1 teaspoon of turmeric mixed with honey daily.", 'bot');
    speakText("For hives, take 1 teaspoon of turmeric mixed with honey daily.");
} else if (userInput.includes("ulcers")) {
    addMessage("For ulcers, consume 1 cup of aloe vera juice daily.", 'bot');
    speakText("For ulcers, consume 1 cup of aloe vera juice daily.");
} else if (userInput.includes("sore muscles")) {
    addMessage("For sore muscles, take a warm bath with Epsom salt.", 'bot');
    speakText("For sore muscles, take a warm bath with Epsom salt.");
} else if (userInput.includes("nail fungus")) {
    addMessage("For nail fungus, apply tea tree oil to the affected nail daily.", 'bot');
    speakText("For nail fungus, apply tea tree oil to the affected nail daily.");
} else if (userInput.includes("chronic fatigue")) {
    addMessage("For chronic fatigue, consume 1 tablespoon of honey mixed with lemon in warm water daily.", 'bot');
    speakText("For chronic fatigue, consume 1 tablespoon of honey mixed with lemon in warm water daily.");
} else if (userInput.includes("memory issues")) {
    addMessage("For memory issues, consume 1 tablespoon of ginkgo biloba extract daily.", 'bot');
    speakText("For memory issues, consume 1 tablespoon of ginkgo biloba extract daily.");
}

    
    else {
        const response = dataset[userInput] || "I'm sorry, I don't have information on that. Please ask something else.";
        addMessage(response, 'bot');
        speakText(response); // Speak the fallback response
    }
}

// Voice synthesis for bot responses
function speakText(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language for voice synthesis
    synth.speak(utterance);
}
