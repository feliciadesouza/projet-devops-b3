import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'medecin') {
        navigate('/dashboard');
      } else {
        navigate('/mon-carnet');
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏥 DiabèteTrack</h1>
        <h2 style={styles.subtitle}>Connexion</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">
            Se connecter
          </button>
        </form>
        <p style={styles.link}>
          Pas de compte ? <a href="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px' },
  title: { textAlign: 'center', color: '#2b6cb0', marginBottom: '8px' },
  subtitle: { textAlign: 'center', color: '#4a5568', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', marginBottom: '16px' },
  link: { textAlign: 'center', marginTop: '16px', color: '#4a5568' },
};

export default Login;