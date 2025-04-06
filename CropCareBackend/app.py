from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(r'F:\SIH\Code\CropCareBackend\firebase_credentials.json.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/save-coordinates', methods=['POST'])
def save_coordinates():
    try:
        # Get data from request
        data = request.get_json()
        crop = data.get('crop')
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        # Structure the data to store in Firestore
        doc_data = {
            'crop': crop,
            'latitude': latitude,
            'longitude': longitude
        }

        # Save data to Firestore under a collection called 'crop_locations'
        db.collection('crop_locations').add(doc_data)

        return jsonify({'status': 'success', 'message': 'Data stored successfully'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
