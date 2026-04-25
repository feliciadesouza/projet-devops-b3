import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGlygemies, ajouterGlygemie, deleteGlygemie } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

function CarnetGlygemie() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [glycemies, setGlygemies] = useState([]);
  const [alerte, setAlerte] = useState('');
  const [form, setForm] = useState({ valeur: '', moment: 'matin', date: '', commentaire: '' });

  useEffect(() => {
    fetchGlygemies();
  }, []);

  const fetchGlygemies = async () => {
    try {
      const res = await getGlygemies(patientId);
      setGlygemies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await ajouterGlygemie({ ...form, patientId, valeur: parseFloat(form.valeur) });
      if (res.data.alerte) setAlerte(res.data.alerte);
      else setAlerte('');
      setForm({ valeur: '', moment: 'matin', date: '', commentaire: '' });
      fetchGlygemies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await deleteGlygemie(id);
    fetchGlygemies();
  };

  const chartData = [...glycemies].reverse().map((g) => ({
    date: `${g.date} ${g.moment}`,
    valeur: g.valeur,
  }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Retour</button>
        <h1>📊 Carnet de Glycémie</h1>
      </div>

      {alerte && <div style={styles.alerte}>{alerte}</div>}

      <div style={styles.content}>
        <div style={styles.formCard}>
          <h2>Ajouter une mesure</h2>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} type="number" step="0.1" placeholder="Glycémie (mmol/L)" value={form.valeur} onChange={(e) => setForm({ ...form, valeur: e.target.value })} required />
            <select style={styles.input} value={form.moment} onChange={(e) => setForm({ ...form, moment: e.target.value })}>
              <option value="matin">Matin</option>
              <option value="midi">Midi</option>
              <option value="soir">Soir</option>
              <option value="nuit">Nuit</option>
            </select>
            <input style={styles.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <textarea style={styles.input} placeholder="Commentaire (optionnel)" value={form.commentaire} onChange={(e) => setForm({ ...form, commentaire: e.target.value })} />
            <button style={styles.button} type="submit">Ajouter</button>
          </form>
        </div>

        <div style={styles.chartCard}>
          <h2>Évolution de la glycémie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 20]} />
              <Tooltip />
              <ReferenceLine y={3.9} stroke="orange" label="Hypo" />
              <ReferenceLine y={10} stroke="red" label="Hyper" />
              <Line type="monotone" dataKey="valeur" stroke="#2b6cb0" strokeWidth={2} dot={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.tableCard}>
          <h2>Historique des mesures</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Moment</th>
                <th>Valeur (mmol/L)</th>
                <th>Commentaire</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {glycemies.map((g) => (
                <tr key={g.id} style={g.valeur < 3.9 || g.valeur > 10 ? styles.alertRow : {}}>
                  <td>{g.date}</td>
                  <td>{g.moment}</td>
                  <td><strong>{g.valeur}</strong></td>
                  <td>{g.commentaire || '-'}</td>
                  <td>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(g.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  header: { backgroundColor: '#2b6cb0', color: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '20px' },
  backBtn: { padding: '8px 16px', backgroundColor: 'white', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  alerte: { backgroundColor: '#fed7d7', color: '#c53030', padding: '16px 32px', fontSize: '18px', fontWeight: 'bold' },
  content: { padding: '32px', display: 'grid', gap: '24px' },
  formCard: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  chartCard: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  tableCard: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  alertRow: { backgroundColor: '#fff5f5' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
};

export default CarnetGlygemie;