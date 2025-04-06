// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDkaH_Gs52XxXHa5Pr8ijlaRs8svYdkYc",
    authDomain: "cropcare-d9503.firebaseapp.com",
    projectId: "cropcare-d9503",
    storageBucket: "cropcare-d9503.appspot.com",
    messagingSenderId: "236455261890",
    appId: "1:236455261890:web:16f5b9e9ea02cc0349ed5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Handle Sign Up (User Registration)
document.querySelector('.register-container .submit').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent form from refreshing the page

    // Get the email and password from the form
    const email = document.querySelector('.register-container input[placeholder="Email"]').value;
    const password = document.querySelector('.register-container input[placeholder="Password"]').value;

    // Firebase function to create a new user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully created new user
            const user = userCredential.user;
            alert("User registered successfully!");
            console.log("User created:", user);

            // Optionally redirect after signup (to dashboard or home page)
            window.location.href = 'login.html';  // Change 'dashboard.html' to your redirect page
        })
        .catch((error) => {
            console.error("Error creating user:", error);
            alert("Error: " + error.message);
        });
});

// Handle Login (User Sign In)
document.querySelector('.login-container .submit').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent form from refreshing the page

    // Get the email and password from the form
    const email = document.querySelector('.login-container input[placeholder="Username or Email"]').value;
    const password = document.querySelector('.login-container input[placeholder="Password"]').value;

    // Firebase function to sign in the user
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successfully logged in
            const user = userCredential.user;
            alert("Logged in successfully!");
            console.log("User logged in:", user);

            // Optionally redirect after login (to dashboard or home page)
            window.location.href = 'location_crop.html';  // Change 'dashboard.html' to your redirect page
        })
        .catch((error) => {
            console.error("Login error:", error);
            alert("Error: " + error.message);
        });
});
