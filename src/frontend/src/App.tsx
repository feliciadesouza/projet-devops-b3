import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==================== LOGIN ====================
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'medecin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/mon-carnet';
      }
    } catch {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px' }}>
        <h1 style={{ textAlign: 'center', color: '#2b6cb0' }}>🏥 DiabèteTrack</h1>
        <h2 style={{ textAlign: 'center', color: '#4a5568' }}>Connexion</h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box' }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box' }}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button style={{ width: '100%', padding: '12px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }} type="submit">
            Se connecter
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#4a5568' }}>
          Pas de compte ? <a href="/register" style={{ color: '#2b6cb0' }}>S'inscrire</a>
        </p>
      </div>
    </div>
  );
}

// ==================== REGISTER ====================
function Register() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'medecin' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Compte créé avec succès ! Connectez-vous.');
      window.location.href = '/';
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '450px' }}>
        <h1 style={{ textAlign: 'center', color: '#2b6cb0' }}>🏥 DiabèteTrack</h1>
        <h2 style={{ textAlign: 'center', color: '#4a5568' }}>Créer un compte</h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
              placeholder="Nom"
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              required
            />

            <input
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
              placeholder="Prénom"
              value={form.prenom}
              onChange={e => setForm({ ...form, prenom: e.target.value })}
              required
            />
          </div>

          <input
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box' }}
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <select
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px' }}
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="medecin">👨‍⚕️ Je suis médecin</option>
            <option value="patient">🧑 Je suis patient</option>
          </select>

          <button style={{ width: '100%', padding: '12px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }} type="submit">
            Créer mon compte
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#4a5568' }}>
          Déjà un compte ? <a href="/" style={{ color: '#2b6cb0' }}>Se connecter</a>
        </p>
      </div>
    </div>
  );
}

// ==================== DASHBOARD MEDECIN ====================
function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    typeDiabete: 'type2',
    telephone: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPatients = useCallback(async () => {
    try {
      const res = await API.get('/patients');
      setPatients(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userRes = await API.post('/auth/register', {
        ...form,
        password: 'patient123',
        role: 'patient'
      });

      await API.post('/patients', {
        userId: userRes.data.userId,
        dateNaissance: form.dateNaissance,
        typeDiabete: form.typeDiabete,
        telephone: form.telephone
      });

      setShowForm(false);
      setForm({
        nom: '',
        prenom: '',
        email: '',
        dateNaissance: '',
        typeDiabete: 'type2',
        telephone: ''
      });
      fetchPatients();
    } catch (e: any) {
      alert('Erreur: ' + e.response?.data?.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <div style={{ backgroundColor: '#2b6cb0', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>🏥 DiabèteTrack</h1>
        <div>
          <span style={{ marginRight: '16px' }}>👨‍⚕️ Dr. {user.nom} {user.prenom}</span>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            style={{ padding: '8px 16px', backgroundColor: 'white', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Mes Patients ({patients.length})</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '10px 20px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            + Ajouter un patient
          </button>
        </div>

        {showForm && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h3>Nouveau Patient</h3>

            <form onSubmit={handleAddPatient}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  placeholder="Nom"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  required
                />

                <input
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  placeholder="Prénom"
                  value={form.prenom}
                  onChange={e => setForm({ ...form, prenom: e.target.value })}
                  required
                />

                <input
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />

                <input
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  placeholder="Téléphone"
                  value={form.telephone}
                  onChange={e => setForm({ ...form, telephone: e.target.value })}
                />

                <input
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  type="date"
                  value={form.dateNaissance}
                  onChange={e => setForm({ ...form, dateNaissance: e.target.value })}
                  required
                />

                <select
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  value={form.typeDiabete}
                  onChange={e => setForm({ ...form, typeDiabete: e.target.value })}
                >
                  <option value="type1">Type 1</option>
                  <option value="type2">Type 2</option>
                  <option value="gestationnel">Gestationnel</option>
                </select>
              </div>

              <button
                type="submit"
                style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Créer le patient
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {patients.length === 0 ? (
            <p>Aucun patient pour l'instant. Ajoutez votre premier patient !</p>
          ) : (
            patients.map((p: any) => (
              <div key={p.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3>👤 {p.User?.nom} {p.User?.prenom}</h3>
                <p>🩺 Diabète {p.typeDiabete}</p>
                <p>📞 {p.telephone || 'Non renseigné'}</p>
                <button
                  onClick={() => window.location.href = `/patient/${p.id}`}
                  style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Voir le carnet →
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== CARNET GLYCEMIE ====================
function Carnet({ patientIdProp }: { patientIdProp?: string }) {
  const pathId = window.location.pathname.split('/').pop();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const patientId = patientIdProp || pathId;
  const isMedecin = user.role === 'medecin';

  const [glycemies, setGlygemies] = useState<any[]>([]);
  const [alerte, setAlerte] = useState('');
  const [form, setForm] = useState({
    valeur: '',
    moment: 'matin',
    date: new Date().toISOString().split('T')[0],
    commentaire: ''
  });

  const fetchGlygemies = useCallback(async () => {
    try {
      const res = await API.get(`/glycemies/patient/${patientId}`);
      setGlygemies(res.data);
    } catch {}
  }, [patientId]);

  useEffect(() => {
    fetchGlygemies();
  }, [fetchGlygemies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/glycemies', {
        ...form,
        patientId: parseInt(patientId!),
        valeur: parseFloat(form.valeur)
      });

      if (res.data.alerte) setAlerte(res.data.alerte);
      else setAlerte('');

      setForm({
        valeur: '',
        moment: 'matin',
        date: new Date().toISOString().split('T')[0],
        commentaire: ''
      });

      fetchGlygemies();
    } catch {}
  };

  const handleDelete = async (id: number) => {
    await API.delete(`/glycemies/${id}`);
    fetchGlygemies();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <div style={{ backgroundColor: '#2b6cb0', color: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isMedecin && (
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{ padding: '8px 16px', backgroundColor: 'white', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            ← Retour
          </button>
        )}

        <h1 style={{ margin: 0 }}>📊 {isMedecin ? 'Carnet du Patient' : 'Mon Carnet de Glycémie'}</h1>

        {!isMedecin && (
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            style={{ marginLeft: 'auto', padding: '8px 16px', backgroundColor: 'white', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Déconnexion
          </button>
        )}
      </div>

      {alerte && (
        <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '16px 32px', fontSize: '18px', fontWeight: 'bold' }}>
          {alerte}
        </div>
      )}

      <div style={{ padding: '32px', display: 'grid', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2>Ajouter une mesure</h2>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <input
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              type="number"
              step="0.1"
              placeholder="Glycémie (mmol/L)"
              value={form.valeur}
              onChange={e => setForm({ ...form, valeur: e.target.value })}
              required
            />

            <select
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              value={form.moment}
              onChange={e => setForm({ ...form, moment: e.target.value })}
            >
              <option value="matin">Matin</option>
              <option value="midi">Midi</option>
              <option value="soir">Soir</option>
              <option value="nuit">Nuit</option>
            </select>

            <input
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
            />

            <button
              type="submit"
              style={{ padding: '10px 20px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              Ajouter
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2>Historique des mesures</h2>

          {glycemies.length === 0 ? (
            <p>Aucune mesure enregistrée</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Moment</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Valeur (mmol/L)</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Statut</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {glycemies.map((g: any) => (
                  <tr key={g.id} style={{ backgroundColor: g.valeur < 3.9 || g.valeur > 10 ? '#fff5f5' : 'white' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{g.date}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>{g.moment}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}><strong>{g.valeur}</strong></td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                      {g.valeur < 3.9 ? '🔴 Hypoglycémie' : g.valeur > 10 ? '🟠 Hyperglycémie' : '🟢 Normal'}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                      <button
                        onClick={() => handleDelete(g.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== MON CARNET (PATIENT) ====================
function MonCarnet() {
  const [patientInfo, setPatientInfo] = useState<any>(null);

  useEffect(() => {
    const fetchMyPatientId = async () => {
      try {
        const res = await API.get('/patients/me');
        setPatientInfo(res.data);
      } catch {}
    };

    fetchMyPatientId();
  }, []);

  if (!patientInfo) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement de votre carnet...</p>
      </div>
    );
  }

  return <Carnet patientIdProp={String(patientInfo.id)} />;
}

// ==================== ROUTES ====================
const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute role="medecin"><Dashboard /></PrivateRoute>} />
        <Route path="/patient/:id" element={<PrivateRoute role="medecin"><Carnet /></PrivateRoute>} />
        <Route path="/mon-carnet" element={<PrivateRoute role="patient"><MonCarnet /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;