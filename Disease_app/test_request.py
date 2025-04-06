import requests

url = "http://127.0.0.1:5000/predict"
image_path = "D:/SIH/sugarcane/Sugarcane Leaf Disease Dataset/Healthy/healthy (1).jpeg"

files = {"image": open(image_path, "rb")}

response = requests.post(url, files=files)

print(response.json())  # Print the response
