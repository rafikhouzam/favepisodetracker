from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import sqlite3

app = Flask(__name__)
CORS(app)
DATABASE = 'family_guy_favorites.db'
TVMAZE_EPISODE_API = 'https://api.tvmaze.com/shows/84/episodes'

def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(query, args)
    rv = cursor.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

@app.route('/favorites', methods=['POST'])
def add_favorite():
    user_id = request.json.get('user_id')
    season = request.json.get('season')
    episode_number = request.json.get('episode_number')

    # Fetch episode data from TVMaze
    response = requests.get(TVMAZE_EPISODE_API)
    if response.status_code != 200:
        return jsonify({"error": "Unable to fetch episode data"}), 500

    episodes = response.json()
    episode = next((ep for ep in episodes if ep['season'] == season and ep['number'] == episode_number), None)
    if not episode:
        return jsonify({"error": "Episode not found"}), 404

    # Save favorite in local DB
    query_db(
        'INSERT INTO favorites (user_id, episode_id, season, episode_number) VALUES (?, ?, ?, ?)',
        (user_id, episode['id'], season, episode_number)
    )

    return jsonify({"message": "Episode marked as favorite"}), 200

"""@app.route('/users/<int:user_id>/favorites', methods=['GET'])
def get_favorites(user_id):
    # Get favorite episode IDs for the user from local database
    favorites = query_db('SELECT season, episode_number FROM favorites WHERE user_id = ?', (user_id,))
    episode_ids = [f[0] for f in favorites]

    # Fetch episode details from TVMaze API
    response = requests.get(TVMAZE_EPISODE_API)
    if response.status_code != 200:
        return jsonify({"error": "Unable to fetch episode data"}), 500

    episodes = response.json()
    user_favorites = [ep for ep in episodes if ep['id'] in episode_ids]

    return jsonify(user_favorites), 200"""

@app.route('/users/<int:user_id>/favorites', methods=['GET'])
def get_favorites(user_id):
    # Step 1: Get season and episode_number for user's favorites from the database
    favorites = query_db('SELECT season, episode_number FROM favorites WHERE user_id = ?', (user_id,))
    
    # Create a list of tuples like [(season, episode_number), ...]
    favorite_episodes = [(f[0], f[1]) for f in favorites]

    # Step 2: Fetch all episodes from the TVMaze API
    response = requests.get(TVMAZE_EPISODE_API)
    if response.status_code != 200:
        return jsonify({"error": "Unable to fetch episode data"}), 500

    # Parse the episode data from the API response
    episodes = response.json()

    # Step 3: Filter episodes that match the user's favorites
    user_favorites = [
        ep for ep in episodes
        if (ep['season'], ep['number']) in favorite_episodes  # Match both season and episode_number
    ]

    # Return the filtered episodes
    return jsonify(user_favorites), 200


if __name__ == '__main__':
    app.run(debug=True)


