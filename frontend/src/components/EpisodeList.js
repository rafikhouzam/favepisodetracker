/*

###Episode List with NO dropdown###

import React, { useEffect, useState } from 'react';
import { fetchEpisodes } from '../api';
import FavoriteButton from './FavoriteButton';

const EpisodeList = ({ userId }) => {
    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        const loadEpisodes = async () => {
            const episodesData = await fetchEpisodes();
            setEpisodes(episodesData);
        };
        loadEpisodes();
    }, []);

    return (
        <div>
            <h2>All Episodes</h2>
            <ul>
                {episodes.map((episode) => (
                    <li key={episode.id}>
                        <strong>S{episode.season} E{episode.number}: {episode.name}</strong>
                        <p>{episode.summary ? episode.summary.replace(/<[^>]+>/g, '') : 'No description available.'}</p>
                        <FavoriteButton userId={userId} season={episode.season} episodeNumber={episode.number} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EpisodeList;*/

import React, { useEffect, useState } from 'react';
import { fetchEpisodes } from '../api';
import FavoriteButton from './FavoriteButton';

const EpisodeList = ({ userId }) => {
    const [groupedEpisodes, setGroupedEpisodes] = useState({});

    useEffect(() => {
        const loadEpisodes = async () => {
            const episodesData = await fetchEpisodes();
            const episodesBySeason = episodesData.reduce((acc, episode) => {
                const season = episode.season;
                if (!acc[season]) acc[season] = [];
                acc[season].push(episode);
                return acc;
            }, {});

            setGroupedEpisodes(episodesBySeason);
        };
        loadEpisodes();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center">All Episodes</h2>
            {Object.keys(groupedEpisodes).map((season) => (
                <details key={season} className="my-3">
                    <summary><h4>Season {season}</h4></summary>
                    <ul>
                        {groupedEpisodes[season].map((episode) => (
                            <li key={episode.id} className="mb-3">
                                <strong>S{episode.season} E{episode.number}: {episode.name}</strong>
                                <p>{episode.summary ? episode.summary.replace(/<[^>]+>/g, '') : 'No description available.'}</p>
                                <FavoriteButton userId={userId} season={episode.season} episodeNumber={episode.number} />
                            </li>
                        ))}
                    </ul>
                </details>
            ))}
        </div>
    );
};

export default EpisodeList;
