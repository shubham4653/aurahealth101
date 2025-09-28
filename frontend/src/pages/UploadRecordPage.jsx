import React, { useState, useContext, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import { ThemeContext } from '../context/ThemeContext';
import { getAllPatients } from '../api/patients';
import { api } from '../api/auth';
import { Upload, FileText, Shield, CheckCircle } from 'lucide-react';

const UploadRecordPage = () => {
  const { theme } = useContext(ThemeContext);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [recordType, setRecordType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please select a PDF, image, or document file.');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size too large. Please select a file smaller than 10MB.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    if (!recordType) {
      setError('Please enter a record type');
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
    setUploadProgress(0);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientId', selectedPatient);
      formData.append('recordType', recordType);
      formData.append('description', description);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      const response = await api.post('/medical-record/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = response.data;
      setResult(data);
      
      // Reset form
      setSelectedPatient('');
      setRecordType('');
      setDescription('');
      setSelectedFile(null);
      
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      setError(serverMessage || err.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen">
      <GlassCard className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-8 h-8 text-blue-500" />
          <h1 className={`text-3xl font-bold ${theme.text}`}>Upload Medical Record</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className={`block mb-2 font-semibold ${theme.text}`}>Select Patient</label>
            <select 
              className={`w-full p-3 rounded-lg border-2 ${theme.accent} ${theme.text} focus:ring-2 focus:ring-blue-500`} 
              value={selectedPatient} 
              onChange={e => setSelectedPatient(e.target.value)} 
              required
            >
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
                <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <p className={`font-medium ${theme.text}`}>Patient Information</p>
                  </div>
                  <p className={`text-sm ${theme.text}`}><strong>Name:</strong> {patient.name}</p>
                  <p className={`text-sm ${theme.text}`}><strong>Wallet:</strong> {patient.walletAddress || 'Not connected'}</p>
                </div>
              ) : null;
            })()}
          </div>

          {/* Record Type */}
          <div>
            <label className={`block mb-2 font-semibold ${theme.text}`}>Record Type</label>
            <input 
              type="text" 
              className={`w-full p-3 rounded-lg border-2 ${theme.accent} ${theme.text} focus:ring-2 focus:ring-blue-500`} 
              value={recordType} 
              onChange={e => setRecordType(e.target.value)} 
              placeholder="e.g. Lab Report, Prescription, X-Ray" 
              required 
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block mb-2 font-semibold ${theme.text}`}>Description (Optional)</label>
            <textarea 
              className={`w-full p-3 rounded-lg border-2 ${theme.accent} ${theme.text} focus:ring-2 focus:ring-blue-500`} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Additional details about this record..."
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className={`block mb-2 font-semibold ${theme.text}`}>Upload File</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className={`text-lg font-medium ${theme.text}`}>
                  {selectedFile ? selectedFile.name : 'Click to select file'}
                </p>
                <p className={`text-sm ${theme.text} opacity-70`}>
                  PDF, Images, Documents (Max 10MB)
                </p>
              </label>
            </div>
            {selectedFile && (
              <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className={`text-sm font-medium ${theme.text}`}>File Selected: {selectedFile.name}</p>
                </div>
                <p className={`text-xs ${theme.text} opacity-70`}>
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isSubmitting && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className={`text-sm ${theme.text}`}>Uploading and registering on blockchain...</p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <AnimatedButton 
            type="submit" 
            className="w-full py-3 text-lg" 
            disabled={isSubmitting || !selectedPatient || !selectedFile || !recordType}
            icon={Upload}
          >
            {isSubmitting ? 'Uploading...' : 'Upload & Register on Blockchain'}
          </AnimatedButton>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-medium">Error:</p>
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {result && (
          <div className="mt-6 p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                Record Successfully Registered!
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <p className={`font-medium ${theme.text}`}>Contract Address:</p>
                <p className="break-all font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {result.data?.contractAddress}
                </p>
              </div>
              <div>
                <p className={`font-medium ${theme.text}`}>Record ID Hash:</p>
                <p className="break-all font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {result.data?.recordIdHash}
                </p>
              </div>
              <div>
                <p className={`font-medium ${theme.text}`}>File Content Hash:</p>
                <p className="break-all font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {result.data?.fileContentHash}
                </p>
              </div>
              <div>
                <p className={`font-medium ${theme.text}`}>Cloudinary URL:</p>
                <p className="break-all font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {result.data?.cloudinaryUrl}
                </p>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default UploadRecordPage;
