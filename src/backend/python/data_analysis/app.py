from flask import Flask, request, jsonify
from datetime import datetime
import analysis_logic # Import the analysis logic

app = Flask(__name__)

def parse_date(date_string):
    """Helper to parse date strings from query params."""
    if not date_string:
        return None
    try:
        # Expecting YYYY-MM-DD format
        return datetime.strptime(date_string, '%Y-%m-%d')
    except ValueError:
        return None # Or raise an error

@app.route('/reports/website-traffic', methods=['GET'])
def get_website_traffic_report():
    """
    Endpoint to get a report on website traffic.
    Accepts optional 'start_date' and 'end_date' query parameters (YYYY-MM-DD).
    """
    try:
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')

        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)

        report_data = analysis_logic.generate_traffic_report(start_date, end_date)
        return jsonify(report_data)

    except Exception as e:
        app.logger.error(f"Error processing /reports/website-traffic request: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

@app.route('/reports/member-engagement', methods=['GET'])
def get_member_engagement_report():
    """
    Endpoint to get a report on member engagement.
    Accepts optional 'start_date' and 'end_date' query parameters (YYYY-MM-DD).
    """
    try:
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')

        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)

        report_data = analysis_logic.generate_member_engagement_report(start_date, end_date)
        return jsonify(report_data)

    except Exception as e:
        app.logger.error(f"Error processing /reports/member-engagement request: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

@app.route('/reports/payments', methods=['GET'])
def get_payment_report():
    """
    Endpoint to get a report on payments.
    Accepts optional 'start_date', 'end_date' (YYYY-MM-DD), and 'status' query parameters.
    """
    try:
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        status = request.args.get('status') # e.g., 'paid', 'pending', 'failed'

        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)

        report_data = analysis_logic.generate_payment_report(start_date, end_date, status)
        return jsonify(report_data)

    except Exception as e:
        app.logger.error(f"Error processing /reports/payments request: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500


if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible externally if needed, e.g., from frontend dev server
    app.run(host='0.0.0.0', port=5002, debug=True)
```