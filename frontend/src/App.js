import React from 'react';
import EpisodeList from './components/EpisodeList';
import UserFavorites from './components/UserFavorites';
import './App.css';

const App = () => {
    const userId = 1; // Static user ID for now; this could be dynamic with a login system

    return (
        <div>
            <h1>Family Guy Favorites</h1>
            <EpisodeList userId={userId} />
            <UserFavorites userId={userId} />
        </div>
    );
};

export default App;
