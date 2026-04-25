import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',backgroundColor:'#f0f4f8'}}>
      <div style={{backgroundColor:'white',padding:'40px',borderRadius:'12px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)',width:'400px'}}>
        <h1 style={{textAlign:'center',color:'#2b6cb0'}}>🏥 DiabèteTrack</h1>
        <h2 style={{textAlign:'center',color:'#4a5568'}}>Connexion</h2>
        {error && <p style={{color:'red',textAlign:'center'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={{width:'100%',padding:'12px',marginBottom:'16px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'16px',boxSizing:'border-box'}} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={{width:'100%',padding:'12px',marginBottom:'16px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'16px',boxSizing:'border-box'}} type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={{width:'100%',padding:'12px',backgroundColor:'#2b6cb0',color:'white',border:'none',borderRadius:'8px',fontSize:'16px',cursor:'pointer'}} type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f0f4f8'}}>
      <div style={{backgroundColor:'#2b6cb0',color:'white',padding:'16px 32px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1 style={{margin:0}}>🏥 DiabèteTrack</h1>
        <div>
          <span style={{marginRight:'16px'}}>Dr. {user.nom} {user.prenom}</span>
          <button onClick={() => { localStorage.clear(); window.location.href='/'; }} style={{padding:'8px 16px',backgroundColor:'white',color:'#2b6cb0',border:'none',borderRadius:'6px',cursor:'pointer'}}>Déconnexion</button>
        </div>
      </div>
      <div style={{padding:'32px'}}>
        <h2>Bienvenue Dr. {user.nom} !</h2>
        <p>Votre tableau de bord est prêt. Les patients apparaîtront ici.</p>
      </div>
    </div>
  );
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;