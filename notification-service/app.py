from flask import Flask, request, jsonify
import datetime

app = Flask(__name__)

# 1. Health Check Route (Used by Jenkins or Docker to check status)
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "service": "notification-service",
        "timestamp": str(datetime.datetime.now())
    }), 200

# 2. Notification Route (Simulates sending an email)
@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.json
    
    # Extract data sent from the main Django app
    recipient = data.get('recipient', 'Unknown')
    subject = data.get('subject', 'No Subject')
    message = data.get('message', '')
    
    # Logic to "send" the email (Printing to console for demo purposes)
    log_entry = f"[{datetime.datetime.now()}] EMAIL SENT TO: {recipient} | SUBJECT: {subject}"
    print(log_entry)
    
    # In a real app, you would use smtplib here to actually email the user
    
    return jsonify({"status": "success", "log": log_entry}), 200

if __name__ == '__main__':
    # Run on Port 5001 (Since Django uses 8000)
    print("Starting Notification Service on Port 5001...")
    app.run(host='0.0.0.0', port=5001)