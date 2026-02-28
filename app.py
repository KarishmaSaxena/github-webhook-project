from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["github"]
collection = db["events"]

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    event_type = request.headers.get('X-GitHub-Event')

    if event_type == "push":
        author = data['pusher']['name']
        to_branch = data['ref'].split('/')[-1]

        doc = {
            "author": author,
            "action": "push",
            "to_branch": to_branch,
            "timestamp": datetime.now(timezone.utc)
        }
        collection.insert_one(doc)

    elif event_type == "pull_request":
        action_type = data['action']
        pr = data['pull_request']
        author = pr['user']['login']
        from_branch = pr['head']['ref']
        to_branch = pr['base']['ref']
        merged = pr['merged']

        if action_type == "closed" and merged:
            doc = {
                "author": author,
                "action": "merge",
                "from_branch": from_branch,
                "to_branch": to_branch,
                "timestamp": datetime.now(timezone.utc)
            }
        else:
            doc = {
                "author": author,
                "action": f"pull_request_{action_type}",
                "from_branch": from_branch,
                "to_branch": to_branch,
                "timestamp": datetime.now(timezone.utc)
            }
        collection.insert_one(doc)

    elif event_type == "issues":
        author = data['issue']['user']['login']
        action = data['action']
        title = data['issue']['title']

        doc = {
            "author": author,
            "action": f"issue_{action}",
            "title": title,
            "timestamp": datetime.now(timezone.utc)
        }
        collection.insert_one(doc)

    return jsonify({"status": "ok"})


@app.route('/events')
def events():
    data = list(collection.find().sort("timestamp", -1).limit(20))

    for d in data:
        d['_id'] = str(d['_id'])
        d['timestamp'] = d['timestamp'].strftime("%d %b %Y %I:%M %p UTC")
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)