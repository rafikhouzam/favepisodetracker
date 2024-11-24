// FavoriteButton.js
import React, { useState } from 'react';
import { addFavorite } from '../api';

const FavoriteButton = ({ userId, season, episodeNumber }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavorite = async () => {
        await addFavorite(userId, season, episodeNumber);
        setIsFavorite(true);
    };

    return (
        <button onClick={handleFavorite} disabled={isFavorite}>
            {isFavorite ? 'Favorited' : 'Favorite'}
        </button>
    );
};

export default FavoriteButton;
