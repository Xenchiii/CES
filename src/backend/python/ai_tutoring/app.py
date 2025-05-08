from flask import Flask, request, jsonify, abort
import ai_model_logic # Import the placeholder logic module

app = Flask(__name__)

@app.route('/ask', methods=['POST'])
def ask_tutor():
    """
    Endpoint to receive a tutoring question and return an AI-generated answer.
    Expects JSON body: {"question": "...", "context": {...}}
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    try:
        data = request.get_json()
        if not data or 'question' not in data or not isinstance(data['question'], str):
            return jsonify({"error": "Missing or invalid 'question' (string) in request body"}), 400

        question = data['question']
        user_context = data.get('context', {}) # Optional context about the user/session
        if not isinstance(user_context, dict):
             return jsonify({"error": "Invalid 'context' (must be an object) in request body"}), 400

        # --- Call the AI Logic ---
        response_text = ai_model_logic.get_answer(question, user_context)
        # --- End AI Logic Call ---

        return jsonify({"response": response_text})

    except Exception as e:
        app.logger.error(f"Error processing /ask request: {e}", exc_info=True) # Log traceback
        return jsonify({"error": "An internal server error occurred processing your request."}), 500

# Simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible externally if needed
    app.run(host='0.0.0.0', port=5001, debug=True) # Ensure port is unique
```