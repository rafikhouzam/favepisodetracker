import axios from 'axios';

// Base URLs for the APIs
const TVMAZE_BASE_URL = 'https://api.tvmaze.com/shows/84/episodes';
const BACKEND_BASE_URL = 'http://127.0.0.1:5000'; // Replace with your Flask API URL

// Fetch all episodes from the TVMaze API
export const fetchEpisodes = async () => {
    const response = await axios.get(TVMAZE_BASE_URL);
    return response.data;
};

// Add an episode to a user's favorites
export const addFavorite = async (userId, season, episodeNumber) => {
    return await axios.post(`${BACKEND_BASE_URL}/favorites`, {
        user_id: userId,
        season,
        episode_number: episodeNumber
    });
};

// Fetch a user's favorite episodes from the backend
export const fetchUserFavorites = async (userId) => {
    const response = await axios.get(`${BACKEND_BASE_URL}/users/${userId}/favorites`);
    return response.data;
};
