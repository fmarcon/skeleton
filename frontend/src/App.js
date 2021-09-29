// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = 'http://localhost:8000';
axios.interceptors.request.use(
  config => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [apiUrl];
    const token = localStorage.getItem('token');
    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function App() {
  const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = useState(storedJwt || null);
  const [foods, setFoods] = useState([]);
  const [fetchError, setFetchError] = useState(null);

const getJwt = async () => {
    const { data } = await axios.get(`${apiUrl}/api/token`);
    localStorage.setItem('token', data.token);
    setJwt(data.token);
  };

const getUsuarios = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/users`);
      setFoods(data);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }
  };
return (
    <>
      <section style={{ marginBottom: '10px' }}>
        <button onClick={() => getJwt()}>Get JWT</button>
        {jwt && (
          <pre>
            <code>{jwt}</code>
          </pre>
        )}
      </section>
      <section>
        <button onClick={() => getUsuarios()}>
          Get Foods
        </button>
        <ul>
          {foods.map((food, i) => (
            <li>{food.description}</li>
          ))}
        </ul>
        {fetchError && (
          <p style={{ color: 'red' }}>{fetchError}</p>
        )}
      </section>
    </>
  );
}
export default App;