import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';
import AnimatedButton from '../ui/AnimatedButton';

const FileIntegrityChecker = ({ record, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setVerificationResult(null);
    }
  };

  const generateFileHash = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      setError('Please select a file to verify');
      return;
    }

    setIsVerifying(true);
    setError('');
    setVerificationResult(null);

    try {
      // Generate hash of the selected file
      const fileHash = await generateFileHash(selectedFile);
      
      // Send verification request to backend
      const res = await fetch(`/api/v1/medical-record/verify/${record._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fileContentHash: fileHash })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      setVerificationResult({
        isValid: data.data.isValid,
        providedHash: data.data.providedHash,
        storedHash: data.data.storedHash
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme.text}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold">File Integrity Verification</h2>
          </div>

          <div className="space-y-6">
            {/* Record Information */}
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
              <h3 className="font-semibold mb-2">Record Information</h3>
              <p className="text-sm"><strong>Type:</strong> {record.recordType}</p>
              <p className="text-sm"><strong>File:</strong> {record.fileName}</p>
              <p className="text-sm"><strong>Stored Hash:</strong> 
                <span className="font-mono text-xs break-all block mt-1">
                  {record.fileContentHash}
                </span>
              </p>
            </div>

            {/* File Selection */}
            <div>
              <label className="block font-semibold mb-2">Select File to Verify</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="verify-file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <label htmlFor="verify-file" className="cursor-pointer">
                  <p className="text-lg font-medium">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </p>
                  <p className="text-sm opacity-70">
                    Select the same file to verify its integrity
                  </p>
                </label>
              </div>
              {selectedFile && (
                <div className="mt-2 p-2 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
                  File selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <div className={`p-4 rounded-lg border-2 ${
                verificationResult.isValid 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {verificationResult.isValid ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className={`font-semibold ${
                    verificationResult.isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {verificationResult.isValid ? 'File Integrity Verified!' : 'File Integrity Failed!'}
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Provided Hash:</strong>
                    <p className="font-mono text-xs break-all mt-1">
                      {verificationResult.providedHash}
                    </p>
                  </div>
                  <div>
                    <strong>Stored Hash:</strong>
                    <p className="font-mono text-xs break-all mt-1">
                      {verificationResult.storedHash}
                    </p>
                  </div>
                </div>

                {!verificationResult.isValid && (
                  <div className="mt-3 p-3 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                        The file you selected does not match the original file. This could mean:
                      </p>
                    </div>
                    <ul className="text-yellow-700 dark:text-yellow-400 text-xs mt-2 ml-6 list-disc">
                      <li>The file has been modified or corrupted</li>
                      <li>You selected a different file</li>
                      <li>The file was not uploaded correctly</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <AnimatedButton
                onClick={handleVerify}
                disabled={!selectedFile || isVerifying}
                className="flex-1"
                icon={Shield}
              >
                {isVerifying ? 'Verifying...' : 'Verify Integrity'}
              </AnimatedButton>
              <AnimatedButton
                onClick={onClose}
                className="px-6"
              >
                Close
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileIntegrityChecker;
