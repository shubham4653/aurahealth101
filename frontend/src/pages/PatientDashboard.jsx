import React, { useContext, useState } from 'react';
import { Heart, Activity, Droplets, Footprints, Watch, FileText, Sparkles, Loader2, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, ReferenceArea } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import { generateWellnessPlan } from '../api/gemini';


// You should move these smaller components to their own files in src/components/features/
const VitalSignCard = ({ icon: Icon, label, value, unit, colorClass }) => {
    const { theme } = useContext(ThemeContext);
    return (<GlassCard className="flex items-center gap-4"><div className={`p-3 rounded-full ${colorClass}`}><Icon className="w-6 h-6 text-white" /></div><div><p className={`text-sm opacity-80 ${theme.text}`}>{label}</p><p className={`text-2xl font-bold ${theme.text}`}>{value} <span className="text-base font-normal">{unit}</span></p></div></GlassCard>);
};

const AnalyticsChart = ({ data, theme, title, yKey1, color1, safeRange, warningRange }) => (
    <GlassCard>
        <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart data={data}>
                    <defs><linearGradient id={`color${yKey1}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color1} stopOpacity={0.8}/><stop offset="95%" stopColor={color1} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.text} strokeOpacity={0.2} />
                    <XAxis dataKey="month" stroke={theme.text} tick={{ fill: theme.text, fontSize: 12 }} />
                    <YAxis stroke={theme.text} tick={{ fill: theme.text, fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: theme.glass, border: 'none', color: theme.text }} />
                    <Legend wrapperStyle={{color: theme.text}}/>
                    <ReferenceArea y1={warningRange[1]} y2={300} fill="red" fillOpacity={0.1} label={{ value: 'Danger', position: 'insideTopRight', fill: 'red', fontSize: 10 }} />
                    <ReferenceArea y1={safeRange[1]} y2={warningRange[1]} fill="yellow" fillOpacity={0.1} label={{ value: 'Warning', position: 'insideTopRight', fill: 'yellow', fontSize: 10 }}/>
                    <ReferenceArea y1={safeRange[0]} y2={safeRange[1]} fill="green" fillOpacity={0.1} label={{ value: 'Safe', position: 'insideTopRight', fill: 'green', fontSize: 10 }}/>
                    <Area type="monotone" dataKey={yKey1} stroke={color1} fillOpacity={1} fill={`url(#color${yKey1})`} name={yKey1.replace(/([A-Z])/g, ' $1').trim()} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </GlassCard>
);

const RecentActivity = ({ activities, theme }) => {
    const [wearableStatus, setWearableStatus] = useState('Not Connected');
    const handleConnect = () => { setWearableStatus('Connecting...'); setTimeout(() => { setWearableStatus('Connected'); }, 2000); };
    return (<GlassCard><div className="flex justify-between items-center mb-4"><h3 className={`text-xl font-bold ${theme.text}`}>Recent Activity</h3><AnimatedButton onClick={handleConnect} icon={Watch} className="text-sm px-4 py-2" disabled={wearableStatus !== 'Not Connected'}>{wearableStatus}</AnimatedButton></div><div className="space-y-4">{activities.map(activity => (<div key={activity.id} className="flex items-start gap-3"><div className={`p-2 rounded-full mt-1 ${theme.primary} ${theme.primaryText}`}><FileText size={16} /></div><div><p className={`font-semibold ${theme.text}`}>{activity.type}</p><p className={`text-sm opacity-80 ${theme.text}`}>{activity.description}</p><p className={`text-xs opacity-60 ${theme.text}`}>{activity.date}</p></div></div>))}</div></GlassCard>);
};

const AIWellnessCoach = ({ user, theme }) => {
    const [showModal, setShowModal] = useState(false);
    const [wellnessPlan, setWellnessPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const getPlan = async () => {
        setIsLoading(true);
        setError('');
        setWellnessPlan(null);
        setShowModal(true);
        
        const healthDataSummary = `Latest Vitals: ${JSON.stringify(user.analytics.vitals)}. Last 6 Months Trends: ${JSON.stringify(user.analytics.monthlyData)}.`;
        const prompt = `Based on the following health data, generate a personalized wellness plan. The user's data shows some trends towards high blood sugar and cholesterol. Provide actionable, simple advice. Return a JSON object with three keys: 'dietarySuggestions', 'exerciseRecommendations', and 'generalAdvice'. Each key should contain an array of short, clear strings.`;
        
        try {
            const plan = await generateWellnessPlan(healthDataSummary, prompt);
            setWellnessPlan(plan);
        } catch (err) {
            console.error("Gemini API Error:", err);
            setError("Failed to generate wellness plan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (<><GlassCard className="text-center"><h3 className={`text-2xl font-bold ${theme.text}`}>AI Wellness Coach</h3><p className={`mt-2 mb-4 opacity-80 ${theme.text}`}>Get a personalized wellness plan based on your latest health data.</p><AnimatedButton onClick={getPlan} icon={Sparkles}>✨ Get Wellness Plan</AnimatedButton></GlassCard>{showModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"><GlassCard className="w-full max-w-2xl"><div className="flex justify-between items-center mb-4"><h2 className={`text-2xl font-bold ${theme.text}`}>Your AI Wellness Plan</h2><button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${theme.secondary} hover:opacity-80`}><X size={20} /></button></div>{isLoading && <div className="flex justify-center items-center h-48"><Loader2 className={`w-12 h-12 animate-spin ${theme.text}`} /></div>}{error && <p className="text-red-500 text-center">{error}</p>}{wellnessPlan && (<div className={`space-y-4 max-h-[60vh] overflow-y-auto pr-2 ${theme.text}`}><div><h4 className={`font-bold text-lg mb-2 ${theme.text}`}>Dietary Suggestions</h4><ul className={`list-disc list-inside space-y-1 text-sm opacity-90 ${theme.text}`}>{wellnessPlan.dietarySuggestions.map((item, i) => <li key={`diet-${i}`}>{item}</li>)}</ul></div><div><h4 className={`font-bold text-lg mb-2 ${theme.text}`}>Exercise Recommendations</h4><ul className={`list-disc list-inside space-y-1 text-sm opacity-90 ${theme.text}`}>{wellnessPlan.exerciseRecommendations.map((item, i) => <li key={`exer-${i}`}>{item}</li>)}</ul></div><div><h4 className={`font-bold text-lg mb-2 ${theme.text}`}>General Advice</h4><ul className={`list-disc list-inside space-y-1 text-sm opacity-90 ${theme.text}`}>{wellnessPlan.generalAdvice.map((item, i) => <li key={`adv-${i}`}>{item}</li>)}</ul></div></div>)}</GlassCard></div>)}</>);
};


const PatientDashboard = ({ user, isViewOnly=false }) => {
    const { theme } = useContext(ThemeContext);
    const analytics = user.analytics;

    return (
        <div className="p-6 space-y-6">
            {!isViewOnly && (
                <div>
                    <h1 className={`text-3xl font-bold ${theme.text}`}>Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className={`opacity-80 ${theme.text}`}>Here's a summary of your health analytics.</p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="sm:col-span-2 lg:col-span-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <VitalSignCard icon={Heart} label="Heart Rate" value={analytics.vitals.heartRate} unit="bpm" colorClass="bg-red-500" />
                        <VitalSignCard icon={Activity} label="Blood Pressure" value={analytics.vitals.bloodPressure} unit="mmHg" colorClass="bg-blue-500" />
                        <VitalSignCard icon={Droplets} label="Blood Sugar" value={analytics.vitals.bloodSugar} unit="mg/dL" colorClass="bg-yellow-500" />
                        <VitalSignCard icon={Footprints} label="Steps Today" value={analytics.vitals.steps.toLocaleString()} unit="steps" colorClass="bg-green-500" />
                    </div>
                </div>
                {!isViewOnly && <AIWellnessCoach user={user} theme={theme} />}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart data={analytics.monthlyData} theme={theme} title="Blood Sugar Trends (Post-Meal)" yKey1="postMealSugar" color1={theme.chartColor1} safeRange={[0, 140]} warningRange={[140, 200]} />
                <AnalyticsChart data={analytics.monthlyData} theme={theme} title="Blood Pressure Trends (Systolic)" yKey1="systolic" color1={theme.chartColor2} safeRange={[0, 120]} warningRange={[120, 140]} />
                <AnalyticsChart data={analytics.monthlyData} theme={theme} title="Cholesterol Trends (LDL)" yKey1="ldl" color1={theme.chartColor1} safeRange={[0, 100]} warningRange={[100, 160]} />
                {!isViewOnly && <RecentActivity activities={analytics.recentActivity} theme={theme} />}
            </div>
        </div>
    );
};

export default PatientDashboard;