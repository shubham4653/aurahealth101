import React, { useState, useContext, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import { ThemeContext } from '../context/ThemeContext';
import { getAllPatients } from '../api/patients';

const UploadRecordPage = () => {
  const { theme } = useContext(ThemeContext);
  const [fileName, setFileName] = useState('');
  const [recordType, setRecordType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        setPatients(response.data || []);
      } catch (err) {
        setError('Failed to fetch patients');
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  // Simulate IPFS hash
  const simulateIpfsHash = () => {
    return 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    const patient = patients.find(p => p._id === selectedPatient);
    if (!patient || !patient.walletAddress) {
      setError('Selected patient does not have a wallet address. Please ask them to connect their wallet first.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setResult(null);
    const ipfsHash = simulateIpfsHash();
    try {
      const res = await fetch('/api/v1/contract/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientOwner: patient.walletAddress,
          ipfsHash
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to deploy contract');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen">
      <GlassCard className="w-full max-w-lg">
        <h1 className={`text-2xl font-bold mb-4 ${theme.text}`}>Upload New Healthcare Record (Provider)</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block mb-1 font-semibold ${theme.text}`}>Select Patient</label>
            <select className={`w-full p-3 rounded-lg border ${theme.accent} ${theme.text}`} value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)} required>
              <option value="">Select a patient...</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} {patient.walletAddress ? '(Wallet Connected)' : '(No Wallet)'}
                </option>
              ))}
            </select>
            {selectedPatient && (() => {
              const patient = patients.find(p => p._id === selectedPatient);
              return patient ? (
                <div className="mt-2 p-2 rounded bg-slate-100 dark:bg-slate-800">
                  <p className={`text-sm ${theme.text}`}><strong>Patient:</strong> {patient.name}</p>
                  <p className={`text-sm ${theme.text}`}><strong>Wallet:</strong> {patient.walletAddress || 'Not connected'}</p>
                </div>
              ) : null;
            })()}
          </div>
          <div>
            <label className={`block mb-1 font-semibold ${theme.text}`}>Record Type</label>
            <input type="text" className={`w-full p-3 rounded-lg border ${theme.accent} ${theme.text}`} value={recordType} onChange={e => setRecordType(e.target.value)} placeholder="e.g. Lab Report, Prescription" required />
          </div>
          <div>
            <label className={`block mb-1 font-semibold ${theme.text}`}>File Name</label>
            <input type="text" className={`w-full p-3 rounded-lg border ${theme.accent} ${theme.text}`} value={fileName} onChange={e => setFileName(e.target.value)} placeholder="e.g. report.pdf" required />
          </div>
          <AnimatedButton type="submit" className="w-full" disabled={isSubmitting}>Upload & Register on Blockchain</AnimatedButton>
        </form>
        {isSubmitting && <p className="mt-4 text-blue-500">Uploading and deploying contract...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-800">
            <p className="font-semibold">Record registered on blockchain!</p>
            <p>Contract Address: <span className="break-all font-mono">{result.contractAddress}</span></p>
            <p>IPFS Hash: <span className="break-all font-mono">{result.ipfsHash}</span></p>
            <p>Record ID Hash: <span className="break-all font-mono">{result.recordIdHash}</span></p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default UploadRecordPage;
