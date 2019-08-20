import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom'

import './Main.css';
import api from '../services/api';

import logo from '../assets/logo_grad.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) {
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id,
                },
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {user: match.params.id},
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });
        
    }, [match.params.id]);

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id },
        });
        setUsers(users.filter(user => user._id !== id));
    }

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id },
        });
        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className='main-container'>
            <Link className='link' to='/'>
                <img className='logo' src={logo} alt='Tindev'/>
            </Link>
            { users.length > 0 ? (
                <ul>
                { users.map(user => (
                    <li key={user._id}>
                        <img src={user.avatar} alt='' />
                        <footer>
                            <strong>{user.name ? user.name : user.user}</strong>
                            <p>{user.bio}</p>
                        </footer>
                        <div className='buttons'>
                            <button id='dislike' type='button' onClick={() => handleDislike(user._id)}>
                                <img src={dislike} alt='Dislike' />
                            </button>
                            <button id='like' type='button' onClick={() => handleLike(user._id)}>
                                <img src={like} alt='Like' />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            ) : (
                <div className='empty'>It's over for now :(</div>
            )}

            { matchDev && (
                <div className='match-container'>
                    <img src={itsamatch} alt="It's a Match" />
                    <img className="avatar" src={matchDev.avatar} alt="avatar"/>
                    <strong>{matchDev.name ? matchDev.name : matchDev.user}</strong>
                    <p>{matchDev.bio}</p>

                    <button onClick={() => setMatchDev(null)} type="button">CLOSE</button>
                </div>
            ) }
            
        </div>
    );
}