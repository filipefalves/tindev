import React, {useState} from 'react';

import './Login.css';
import api from '../services/api';

import logo from '../assets/logo_white.svg';

export default function Login({ history }) {
  const [username, setUsername] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/devs', { username });

    const { _id } = response.data;

    history.push(`/dev/${_id}`);
  }

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit}>
        <img src={logo} alt='Tindev'/>
        <p>Find other devs and get a Match! Try it now!</p>
        <input 
        placeholder='Enter your GitHub username'
        value={username}
        onChange={e => setUsername(e.target.value)}
         />
        <button type='submit'>Start</button>
      </form>
    </div>
  );
}