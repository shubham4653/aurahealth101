import React, { useState, useRef, useContext, useEffect } from 'react';
import { TestTube2, UploadCloud, Sparkles, Loader2, FileJson, ChevronsUpDown, FileText, Database } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import AnimatedButton from '../ui/AnimatedButton';
import { analyzeReport } from '../../api/gemini';
import { api } from '../../api/auth';

const AiReportAnalyzer = ({ user }) => {
    const { theme } = useContext(ThemeContext);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [activeProblem, setActiveProblem] = useState(null);
    const [patientRecords, setPatientRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [fileSource, setFileSource] = useState('upload'); // 'upload' or 'existing'
    const [loadingRecords, setLoadingRecords] = useState(false);

    // Fetch patient records on component mount (only for patients)
    useEffect(() => {
        if (user?.type === 'patient') {
            fetchPatientRecords();
        }
    }, [user]);

    const fetchPatientRecords = async () => {
        setLoadingRecords(true);
        try {
            const response = await api.get('/medical-record/patient', { withCredentials: true });
            setPatientRecords(response.data.data || []);
        } catch (error) {
            console.error('Error fetching patient records:', error);
            setError('Failed to load existing records');
        } finally {
            setLoadingRecords(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setAnalysis(null);
        setActiveProblem(null);
        setError('');

        if (selectedFile.type.startsWith('image/')) {
            setFilePreview(URL.createObjectURL(selectedFile));
        } else if (selectedFile.type === 'application/pdf') {
            setFilePreview('pdf');
        } else {
            setError('Please upload a valid image or PDF file.');
            setFile(null);
            setFilePreview(null);
        }
    };

    const handleRecordSelect = (record) => {
        setSelectedRecord(record);
        setFile(null);
        setFilePreview(null);
        setAnalysis(null);
        setActiveProblem(null);
        setError('');
    };

    const handleFileSourceChange = (source) => {
        setFileSource(source);
        setFile(null);
        setFilePreview(null);
        setSelectedRecord(null);
        setAnalysis(null);
        setActiveProblem(null);
        setError('');
    };

    const handleAnalyze = async () => {
        if (!file && !selectedRecord) {
            setError('Please select a file or existing record first.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setAnalysis(null);
        setActiveProblem(null);

        try {
            let fileToAnalyze = file;
            let fileName = file?.name || '';

            // If using existing record, fetch the file from Cloudinary
            if (selectedRecord && !file) {
                const response = await fetch(selectedRecord.cloudinaryUrl);
                const blob = await response.blob();
                fileToAnalyze = new File([blob], selectedRecord.fileName, { type: selectedRecord.mimeType });
                fileName = selectedRecord.fileName;
            }

            // Handle PDF files with simulated analysis for now
            if (fileToAnalyze.type === 'application/pdf') {
                setTimeout(() => {
                    setAnalysis({
                        metrics: [
                            { metric: 'Glucose (Simulated)', value: '115 mg/dL', range: '70-100 mg/dL', interpretation: 'High' },
                            { metric: 'Cholesterol (Simulated)', value: '220 mg/dL', range: '<200 mg/dL', interpretation: 'High' },
                        ],
                        summary: "The report indicates elevated glucose and cholesterol levels, suggesting a risk of pre-diabetes and potential cardiovascular strain. Other metrics appear within normal ranges.",
                        problems: [
                            { problemName: "High Blood Glucose", explanation: "Elevated glucose levels may indicate insulin resistance or pre-diabetes.", possibleCauses: ["High sugar/carb diet", "Lack of physical activity"], suggestedSolutions: ["Adopt a low-glycemic diet", "Increase regular exercise"], affectedParts: ["pancreas", "liver"] },
                            { problemName: "High Cholesterol", explanation: "High cholesterol can lead to plaque buildup in arteries (atherosclerosis).", possibleCauses: ["Diet high in saturated/trans fats", "Sedentary lifestyle"], suggestedSolutions: ["Eat more soluble fiber (oats, fruits)", "Regular aerobic exercise"], affectedParts: ["heart", "torso"] }
                        ]
                    });
                    setIsLoading(false);
                }, 2000);
                return;
            }
            
            const prompt = `Analyze this medical report image. Provide a JSON object with three keys: 'metrics', 'summary', and 'problems'. 1. 'metrics': An array of objects, each with 'metric', 'value', 'range', and 'interpretation'. 2. 'summary': A brief, 2-3 sentence overall summary of the findings. 3. 'problems': An array of objects for any abnormal findings. Each object should have 'problemName', 'explanation', 'possibleCauses' (array of strings), 'suggestedSolutions' (array of strings), and 'affectedParts' (array of relevant strings from this list: 'head', 'torso', 'heart', 'pancreas', 'liver', 'arms', 'legs').`;
            
            const result = await analyzeReport(fileToAnalyze, prompt);
            setAnalysis(result);
        } catch (err) {
            console.error("API Error:", err);
            setError(`Analysis failed. ${err.message}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getInterpretationColor = (interpretation) => {
        if (!interpretation) return theme.secondaryText;
        const lowerInterp = interpretation.toLowerCase();
        if (lowerInterp === 'high' || lowerInterp === 'critical') return 'text-red-500';
        if (lowerInterp === 'low') return 'text-yellow-500';
        if (lowerInterp === 'normal') return 'text-green-500';
        return theme.secondaryText;
    };

    return (
        <div className="p-6">
            <GlassCard>
                <h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}><TestTube2 /> AI Report Analyzer</h1>
                <p className={`mb-6 opacity-80 ${theme.text}`}>Select an existing medical record or upload a new report (Image/PDF) for AI analysis. The AI provides detailed analysis and summary. This is not a substitute for professional medical advice.</p>
                
                {/* File Source Selection - Only show for patients */}
                {user?.type === 'patient' && (
                    <div className="mb-6">
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => handleFileSourceChange('upload')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    fileSource === 'upload' 
                                        ? 'bg-blue-600 text-white' 
                                        : `${theme.secondary} ${theme.text} hover:bg-opacity-80`
                                }`}
                            >
                                <UploadCloud size={20} />
                                Upload New File
                            </button>
                            <button
                                onClick={() => handleFileSourceChange('existing')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    fileSource === 'existing' 
                                        ? 'bg-blue-600 text-white' 
                                        : `${theme.secondary} ${theme.text} hover:bg-opacity-80`
                                }`}
                            >
                                <Database size={20} />
                                Use Existing Record
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6 items-start">
                    {/* File Upload/Selection Area */}
                    <GlassCard className="h-full">
                        {fileSource === 'upload' || user?.type === 'provider' ? (
                            <>
                                <h3 className={`text-xl font-semibold mb-4 ${theme.text}`}>
                                    {user?.type === 'provider' ? 'Upload Medical Report' : 'Upload New File'}
                                </h3>
                                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                                <div onClick={() => fileInputRef.current.click()} className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${theme.accent} hover:bg-opacity-20 hover:bg-slate-700`}>
                                    {filePreview === 'pdf' ? <div className='text-center'><FileJson size={48} className={`mb-4 mx-auto ${theme.text}`} /><p className={theme.text}>{file?.name}</p></div> : filePreview ? <img src={filePreview} alt="Report preview" className="w-full h-full object-contain rounded-lg" /> : <><UploadCloud size={48} className={`mb-4 ${theme.text}`} /><p className={theme.text}>Click to Upload Report</p><p className={`text-sm opacity-70 ${theme.text}`}>Image or PDF</p></>}
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className={`text-xl font-semibold mb-4 ${theme.text}`}>Select Existing Record</h3>
                                {loadingRecords ? (
                                    <div className="flex items-center justify-center h-64">
                                        <Loader2 size={48} className={`animate-spin ${theme.text}`} />
                                    </div>
                                ) : patientRecords.length > 0 ? (
                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                        {patientRecords.map((record) => (
                                            <div
                                                key={record._id}
                                                onClick={() => handleRecordSelect(record)}
                                                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                                                    selectedRecord?._id === record._id
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : `${theme.secondary} ${theme.text} border-slate-600 hover:bg-opacity-80`
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText size={24} />
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{record.fileName}</p>
                                                        <p className="text-sm opacity-70">{record.recordType}</p>
                                                        <p className="text-xs opacity-50">
                                                            {new Date(record.uploadDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <Database size={48} className={`mb-4 ${theme.text} opacity-50`} />
                                        <p className={`${theme.text} opacity-70`}>No medical records found</p>
                                        <p className={`text-sm ${theme.text} opacity-50`}>Upload some records first to use this feature</p>
                                    </div>
                                )}
                            </>
                        )}
                        
                        <div className="mt-4 text-center">
                            <AnimatedButton 
                                onClick={handleAnalyze} 
                                disabled={(!file && !selectedRecord) || isLoading} 
                                icon={isLoading ? Loader2 : Sparkles}
                            >
                                {isLoading ? 'Analyzing...' : 'Analyze Now'}
                            </AnimatedButton>
                        </div>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </GlassCard>

                    {/* Selected File Preview */}
                    <GlassCard className="h-full">
                        <h3 className={`text-xl font-semibold mb-4 ${theme.text}`}>Selected File</h3>
                        {selectedRecord ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-100 dark:bg-green-900/20">
                                    <FileText size={24} className="text-green-600" />
                                    <div>
                                        <p className="font-semibold text-green-800 dark:text-green-200">{selectedRecord.fileName}</p>
                                        <p className="text-sm text-green-600 dark:text-green-300">{selectedRecord.recordType}</p>
                                    </div>
                                </div>
                                {selectedRecord.description && (
                                    <div>
                                        <p className={`text-sm font-medium ${theme.text}`}>Description:</p>
                                        <p className={`text-sm ${theme.secondaryText}`}>{selectedRecord.description}</p>
                                    </div>
                                )}
                                <div>
                                    <p className={`text-sm font-medium ${theme.text}`}>Uploaded:</p>
                                    <p className={`text-sm ${theme.secondaryText}`}>
                                        {new Date(selectedRecord.uploadDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ) : file ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                    <FileText size={24} className="text-blue-600" />
                                    <div>
                                        <p className="font-semibold text-blue-800 dark:text-blue-200">{file.name}</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-300">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                {filePreview && filePreview !== 'pdf' && (
                                    <img src={filePreview} alt="File preview" className="w-full h-48 object-contain rounded-lg" />
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-center">
                                <FileText size={48} className={`mb-4 ${theme.text} opacity-30`} />
                                <p className={`${theme.text} opacity-50`}>No file selected</p>
                            </div>
                        )}
                    </GlassCard>
                </div>

                {isLoading && <div className="flex items-center justify-center h-48"><Loader2 size={48} className={`animate-spin ${theme.text}`} /></div>}
                
                {analysis && (
                    <GlassCard className="mt-6">
                        <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>Analysis Results</h2>
                        <div className="mb-6">
                            <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>Summary</h3>
                            <p className={theme.text}>{analysis.summary}</p>
                        </div>
                        <div className="mb-6">
                            <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>Potential Problems</h3>
                            <div className="space-y-2">
                                {analysis.problems.map((prob, index) => (
                                    <div key={index} className={`rounded-lg transition-all duration-300 ${theme.secondary}`}>
                                        <button onClick={() => setActiveProblem(activeProblem?.problemName === prob.problemName ? null : prob)} className={`w-full flex justify-between items-center p-4 text-left font-semibold ${theme.secondaryText}`}>
                                            <span>{prob.problemName}</span>
                                            <ChevronsUpDown className={`transition-transform ${activeProblem?.problemName === prob.problemName ? 'rotate-180' : ''}`} />
                                        </button>
                                        {activeProblem?.problemName === prob.problemName && (
                                            <div className={`p-4 border-t border-slate-700/50 ${theme.secondaryText}`}>
                                                <p className="mb-4">{prob.explanation}</p>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div><h4 className="font-bold mb-2">Possible Causes</h4><ul className="list-disc list-inside space-y-1 text-sm">{prob.possibleCauses.map((cause, i) => <li key={`cause-${i}`}>{cause}</li>)}</ul></div>
                                                    <div><h4 className="font-bold mb-2">Suggested Solutions</h4><ul className="list-disc list-inside space-y-1 text-sm">{prob.suggestedSolutions.map((solution, i) => <li key={`solution-${i}`}>{solution}</li>)}</ul></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>Detailed Metrics</h3>
                            <div className="space-y-2">
                                <div className={`grid grid-cols-4 font-bold p-2 ${theme.text}`}><p>Metric</p><p>Value</p><p>Range</p><p>Interpretation</p></div>
                                <div className="max-h-60 overflow-y-auto pr-2">
                                    {analysis.metrics.map((item, index) => (
                                        <div key={index} className={`grid grid-cols-4 p-2 rounded-lg ${theme.secondary} ${theme.secondaryText}`}>
                                            <p className="font-semibold">{item.metric}</p><p>{item.value}</p><p>{item.range}</p><p className={`font-bold ${getInterpretationColor(item.interpretation)}`}>{item.interpretation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                )}
            </GlassCard>
        </div>
    );
};

export default AiReportAnalyzer;