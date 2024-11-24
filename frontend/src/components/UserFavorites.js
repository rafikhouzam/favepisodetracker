import React, { useEffect, useState } from 'react';
import { fetchUserFavorites } from '../api';
import { Container, ListGroup, Badge } from 'react-bootstrap';

const UserFavorites = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            const userFavorites = await fetchUserFavorites(userId);
            setFavorites(userFavorites);
        };
        loadFavorites();
    }, [userId]);

    return (
        <Container className="mt-5">
            <h2>
                Your Favorites <Badge bg="info">{favorites.length}</Badge>
            </h2>
            <ListGroup>
                {favorites.map((episode) => (
                    <ListGroup.Item key={episode.id} className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">S{episode.season} E{episode.number} {episode.name}</div>
                            {episode.description}
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default UserFavorites;
