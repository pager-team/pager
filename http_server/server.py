from src import app


def run_server():
    """
    """

    app.run(host="0.0.0.0", port=8080, debug=True)

run_server()