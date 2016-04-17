import sys
import models
from flask import Flask, render_template, g, jsonify

app = Flask(__name__)

@app.before_request
def before_request():
    g.db = models.db.connect()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/contact")
def contact():
    return render_template('contact.html')

@app.route("/resume")
def resume():
    return render_template('resume.html')

@app.route("/kde")
def kde():
    return render_template('kde.html')

@app.route("/base-stats-browser")
def base_stats_browser():
      return render_template('base-stats-browser.html')

@app.route("/iv-calc")
def iv_calc():
    return render_template('iv-calc.html')

@app.route("/test")
def test():
    return sys.executable

@app.route("/api/basestats", methods=['GET'])
def get_base_stats():
    return jsonify({"objects": models.get_base_stats()})

if __name__ == "__main__":
    app.debug = True
    app.run()
