document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("imageUpload");
    const detectBtn = document.getElementById("detectBtn");
    const previewImage = document.getElementById("previewImage");
    const loading = document.getElementById("loading");
    const result = document.getElementById("result");

    if (!imageUpload || !detectBtn || !previewImage || !loading || !result) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    // Image Preview
    imageUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Detect Disease
    detectBtn.addEventListener("click", function () {
        if (imageUpload.files.length === 0) {
            alert("Please upload an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageUpload.files[0]);

        loading.classList.remove("hidden");
        result.innerHTML = "";

        fetch("/predict", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            loading.classList.add("hidden");
            result.innerHTML = `
                🌿 <strong>Disease:</strong> ${data.disease}<br>
                🩺 <strong>Treatment:</strong> ${data.treatment}<br>
                🎯 <strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%
            `;
        })
        .catch(error => {
            loading.classList.add("hidden");
            result.innerHTML = "❌ Error detecting disease.";
            console.error("Fetch Error:", error);
        });
    });
});