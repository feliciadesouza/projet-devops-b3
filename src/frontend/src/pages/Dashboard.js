import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../services/api';

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏥 DiabèteTrack</h1>
        <div>
          <span style={styles.welcome}>Dr. {user?.nom} {user?.prenom}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2>Mes Patients</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : patients.length === 0 ? (
          <p>Aucun patient pour l'instant</p>
        ) : (
          <div style={styles.grid}>
            {patients.map((patient) => (
              <div
                key={patient.id}
                style={styles.card}
                onClick={() => navigate(`/patient/${patient.id}`)}
              >
                <h3>{patient.User?.nom} {patient.User?.prenom}</h3>
                <p>Type de diabète : <strong>{patient.typeDiabete}</strong></p>
                <p>📞 {patient.telephone || 'Non renseigné'}</p>
                <button style={styles.viewBtn}>Voir le carnet →</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#2b6cb0', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: '24px' },
  welcome: { marginRight: '16px', fontSize: '16px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: 'white', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  content: { padding: '32px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' },
  card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer' },
  viewBtn: { marginTop: '12px', padding: '8px 16px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default Dashboard;