import numpy as np
from tensorflow.keras.models import load_model

# Load the trained model
MODEL_PATH = r"F:\SIH\Code\Disease_app\sugarcane_disease_model.h5"
model = load_model(MODEL_PATH, compile=False)

# Create a sample input with the shape expected by the model
sample_input = np.random.rand(1, 224, 224, 3)  # Adjust the shape as necessary

# Get the model output
output = model.predict(sample_input)
print(f"Model output shape: {output.shape}")
