let smallMap, largeMap;
let marker;

// Initialize Google Maps
function initMap() {
    const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Center of India

    // Small map (satellite view)
    smallMap = new google.maps.Map(document.getElementById('smallMap'), {
        center: defaultLocation,
        zoom: 5,
        mapTypeId: 'satellite',
    });

    // Large map (satellite view)
    largeMap = new google.maps.Map(document.getElementById('largeMap'), {
        center: defaultLocation,
        zoom: 5,
        mapTypeId: 'satellite',
    });

    // Event listener for placing a marker on the large map
    largeMap.addListener('click', (event) => {
        placeMarker(event.latLng, largeMap);
    });

    // Clicking the small map opens the large map in a modal
    document.getElementById('smallMapContainer').addEventListener('click', function () {
        document.getElementById('mapModal').style.display = 'block';
        google.maps.event.trigger(largeMap, 'resize'); // Resize to adjust
        largeMap.setCenter(smallMap.getCenter()); // Keep center consistent with small map
    });

    // Close the modal
    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('mapModal').style.display = 'none';
    });

    // Initialize a marker if it's not yet created
    function placeMarker(location, map) {
        if (marker) {
            marker.setPosition(location);
        } else {
            marker = new google.maps.Marker({
                position: location,
                map: map,
            });
        }
        map.setCenter(location);
    }
}

// Handle form submission to send the selected crop and location to Firestore
document.getElementById('submit').addEventListener('click', async () => {
    if (!marker) {
        alert('Please select a location by clicking on the map.');
        return;
    }

    const selectedCrop = document.getElementById('cropCcre').value;
    const position = marker.getPosition();
    const radius = parseFloat(document.getElementById('geofenceRadius').value); // Get geofence radius

    // Debugging log
    console.log('Submitting data:', {
        latitude: position.lat(),
        longitude: position.lng(),
        cropChoice: selectedCrop,
        geofenceRadius: radius,
    });

    const locationData = {
        latitude: position.lat(),
        longitude: position.lng(),
        cropChoice: selectedCrop,
        geofenceRadius: radius,
        userId: auth.currentUser ? auth.currentUser.uid : 'guest', // Ensure user authentication
    };

    try {
        // Send the data to your Flask backend
        const response = await fetch('http://127.0.0.1:5000/save-coordinates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationData), // Convert the object to a JSON string
        });

        // Handle the response
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        alert(result.message);  // Show success message
    } catch (error) {
        console.error('Error submitting data:', error);
        alert('Failed to submit data.');
    }
});

    async function sendMessage() {
        const userInput = document.getElementById("user-input").value;

        const response = await fetch("http://localhost:3000/chatbot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: userInput }),
        });

        const data = await response.json();
        displayMessage(data.answer); // Display the answer from the chatbot
    }

    function displayMessage(message) {
        const chatWindow = document.getElementById("chat-window");
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
    }

    // Optional: Add an event listener for the 'Enter' key
    document.getElementById("user-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });


// Initialize the map when the page loads
window.onload = initMap;
