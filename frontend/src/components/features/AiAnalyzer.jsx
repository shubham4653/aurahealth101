import React, { useState, useRef, useContext } from 'react';
import { TestTube2, UploadCloud, Sparkles, Loader2, FileJson, ChevronsUpDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';
import AnimatedButton from '../ui/AnimatedButton';
import Human3DModel from './Human3DModel';
import { analyzeReport } from '../../api/gemini';

const AiReportAnalyzer = () => {
    const { theme } = useContext(ThemeContext);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [activeProblem, setActiveProblem] = useState(null);

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

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload a file first.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis(null);
        setActiveProblem(null);

        // This simulates a PDF analysis since Gemini Vision API works with images.
        // In a real scenario, you might use a different model or service for PDFs.
        if (file.type === 'application/pdf') {
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
        
        try {
            const result = await analyzeReport(file, prompt);
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
                <p className={`mb-6 opacity-80 ${theme.text}`}>Upload a report (Image/PDF). The AI provides a detailed analysis, summary, and an interactive 3D visualization of affected areas. This is not a substitute for professional medical advice.</p>
                
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                    <GlassCard className="h-full">
                        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                        <div onClick={() => fileInputRef.current.click()} className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${theme.accent} hover:bg-opacity-20 hover:bg-slate-700`}>
                            {filePreview === 'pdf' ? <div className='text-center'><FileJson size={48} className={`mb-4 mx-auto ${theme.text}`} /><p className={theme.text}>{file?.name}</p></div> : filePreview ? <img src={filePreview} alt="Report preview" className="w-full h-full object-contain rounded-lg" /> : <><UploadCloud size={48} className={`mb-4 ${theme.text}`} /><p className={theme.text}>Click to Upload Report</p><p className={`text-sm opacity-70 ${theme.text}`}>Image or PDF</p></>}
                        </div>
                        <div className="mt-4 text-center"><AnimatedButton onClick={handleAnalyze} disabled={!file || isLoading} icon={isLoading ? Loader2 : Sparkles}>{isLoading ? 'Analyzing...' : 'Analyze Now'}</AnimatedButton></div>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </GlassCard>
                    <GlassCard className="h-full">
                        <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>3D Visualization</h2>
                        <Human3DModel highlightedParts={activeProblem ? activeProblem.affectedParts : []} />
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