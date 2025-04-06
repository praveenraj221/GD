import os
import traceback
import numpy as np
from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from deep_translator import GoogleTranslator  # Using deep_translator instead of googletrans
from werkzeug.utils import secure_filename
import tempfile

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
MODEL_PATH = r"F:\SIH\Code\Disease_app\sugarcane_disease_model.h5"  # Ensure this file exists
try:
    model = load_model(MODEL_PATH, compile=False)  # Load model without compiling
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    traceback.print_exc()

# Define class labels (Modify these as per your dataset)
CLASS_LABELS = [
    "Bacterial Blight", "Banded Cholorosis", "Grassy Shoot", "Healthy", "Mosaic",
    "Pokkah Boeng", "RedRot", "Rust", "Sett Rot", "Yellow"
]

# Define treatment recommendations
TREATMENTS = {
    "Bacterial Blight": "Spray copper-based fungicides and remove infected leaves to stop the disease from spreading.",
    "Banded Cholorosis": "Add zinc-rich fertilizers to the soil and ensure proper watering to keep plants healthy.",
    "Grassy Shoot": "Remove and destroy infected plants. Use recommended insecticides to control the spread.",
    "Healthy": "No action needed! Just keep monitoring your crops to ensure they stay healthy.",
    "Mosaic": "Control aphids using insecticides, as they spread the disease. Choose disease-resistant crop varieties when planting.",
    "Pokkah Boeng": "Trim affected leaves and spray fungicides like carbendazim to stop the infection.",
    "RedRot": "Use healthy, disease-free seeds for planting. Spray fungicides like propiconazole to protect the crop.",
    "Rust": "Apply sulfur-based fungicides and avoid watering leaves directly. Water the base of the plant instead.",
    "Sett Rot": "Before planting, treat seeds with fungicides and ensure proper drainage to prevent rot.",
    "Yellow": "Use nitrogen-rich fertilizers and improve soil quality by adding organic compost."
}

# Function to translate treatment information
def translate_text(text, dest_language):
    try:
        translated_text = GoogleTranslator(source="auto", target=dest_language).translate(text)
        return translated_text
    except Exception as e:
        print(f"❌ Translation error: {e}")
        return text  # Return original text if translation fails

@app.route("/")
def home():
    return render_template("disease_prediction.html")  # Ensure this template exists in 'templates/' folder

@app.route("/translate", methods=["POST"])
def translate():
    try:
        data = request.json
        text = data.get("text", "")
        target_language = data.get("lang", "en")  # Default to English

        if not text:
            return jsonify({"error": "No text provided"}), 400

        translated_text = translate_text(text, target_language)

        return jsonify({"translated_text": translated_text})

    except Exception as e:
        print("❌ Translation error:", str(e))
        return jsonify({"error": "Translation failed"}), 500

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Secure filename
        filename = secure_filename(file.filename)

        # Save uploaded image to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_filename = temp_file.name
            file.save(temp_filename)

        # Load and preprocess image
        img = image.load_img(temp_filename, target_size=(224, 224))  # Adjust to model input
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Expand dimensions for batch processing
        img_array /= 255.0  # Normalize pixel values

        # Make prediction
        predictions = model.predict(img_array)
        class_idx = np.argmax(predictions[0])  # Get predicted class index
        confidence = float(np.max(predictions[0]))  # Get confidence score

        # Get class label and treatment
        predicted_disease = CLASS_LABELS[class_idx]
        treatment = TREATMENTS.get(predicted_disease, "No treatment information available.")

        # Delete the temporary image
        os.remove(temp_filename)

        # Check if translation is requested
        language = request.args.get("lang", "en")  # Default is English
        if language != "en":
            treatment = translate_text(treatment, language)

        # Send response
        return jsonify({
            "disease": predicted_disease,
            "treatment": treatment,
            "confidence": confidence
        })

    except Exception as e:
        print("❌ Error:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500  # Return HTTP 500 error

if __name__ == "__main__":
    app.run(debug=True)
