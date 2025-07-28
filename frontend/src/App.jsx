import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, ReferenceArea } from 'recharts';
import { ShieldCheck, User, FileText, Activity, Users, BrainCircuit, Palette, LogOut, Settings, Bell, ChevronDown, UploadCloud, Lock, Mail, Phone, Calendar, MapPin, Sparkles, TestTube2, ImageUp, Loader2, FileJson, ChevronsUpDown, Heart, Droplets, Footprints, Watch, X, Download, AlertTriangle, Stethoscope, Pill, Search, Send, CalendarPlus, CheckCircle, GraduationCap, Award, Cake, VenetianMask, TestTube, MessageSquare, ListTodo, ClipboardPlus, SlidersHorizontal, UserCheck, UserX } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- THEME CONFIGURATION ---
const themes = {
  prestige: { name: 'Prestige', bg: 'bg-slate-900', text: 'text-slate-100', primary: 'bg-blue-600', primaryText: 'text-white', secondary: 'bg-slate-800', secondaryText: 'text-slate-100', accent: 'border-blue-500', gradientFrom: 'from-blue-600', gradientTo: 'to-indigo-500', glass: 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50', chartColor1: '#3b82f6', chartColor2: '#818cf8' },
  synthwave: { name: 'Synthwave', bg: 'bg-gray-900', text: 'text-cyan-300', primary: 'bg-pink-500', primaryText: 'text-white', secondary: 'bg-cyan-400', secondaryText: 'text-gray-900', accent: 'border-pink-500', gradientFrom: 'from-pink-500', gradientTo: 'to-cyan-400', glass: 'bg-black/30 backdrop-blur-xl border-pink-500/50', chartColor1: '#ec4899', chartColor2: '#22d3ee' },
  minty: { name: 'Minty', bg: 'bg-emerald-50', text: 'text-emerald-800', primary: 'bg-emerald-500', primaryText: 'text-white', secondary: 'bg-white', secondaryText: 'text-emerald-800', accent: 'border-emerald-500', gradientFrom: 'from-emerald-400', gradientTo: 'to-green-500', glass: 'bg-white/50 backdrop-blur-xl border-emerald-300/50', chartColor1: '#10b981', chartColor2: '#22c55e' },
  peach: { name: 'Peach', bg: 'bg-orange-50', text: 'text-orange-800', primary: 'bg-orange-500', primaryText: 'text-white', secondary: 'bg-white', secondaryText: 'text-orange-800', accent: 'border-orange-500', gradientFrom: 'from-red-400', gradientTo: 'to-orange-400', glass: 'bg-white/60 backdrop-blur-xl border-orange-300/50', chartColor1: '#f87171', chartColor2: '#fb923c' },
};

const ThemeContext = createContext();

// --- MOCK DATA ---
const mockPatientData = {
  name: 'Alex Doe', id: 'PID-23BCE1369', email: 'alex.doe@email.com', phone: '+1 234 567 890', dob: '1995-08-22', address: '123 Health St, Medville, MD',
  gender: 'Male', bloodGroup: 'O+',
  allergies: ['Peanuts', 'Penicillin'],
  chronicConditions: ['Asthma', 'Seasonal Allergies'],
  emergencyContact: { name: 'Jane Doe', relation: 'Spouse', phone: '+1 234 567 891' },
  providers: [ { id: 'DOC-98765', name: 'Dr. Evelyn Reed', specialty: 'Cardiology' }, { id: 'DOC-12345', name: 'Dr. John Smith', specialty: 'General Practice' } ],
  appointments: [ { id: 1, providerName: 'Dr. Evelyn Reed', date: '2025-08-05', time: '11:00 AM', reason: 'Annual Checkup' } ],
  records: [ 
      { id: 1, type: 'Blood Test', date: '2025-07-15', doctor: 'Dr. John Smith', file: 'blood_test_1.pdf', blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b' }, 
      { id: 2, type: 'X-Ray', date: '2025-06-20', doctor: 'Dr. Evelyn Reed', file: 'xray_chest.pdf', blockchainHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e' }, 
  ],
  permissions: [
      { id: 1, grantee: 'Dr. Evelyn Reed', scope: 'Full Record', duration: 'Indefinite', status: 'Active' },
      { id: 2, grantee: 'City Hospital Research', scope: 'Anonymized Vitals', duration: 'Expires in 3 months', status: 'Active' },
      { id: 3, grantee: 'Dr. John Smith', scope: 'Lab Reports Only', duration: 'Expired', status: 'Inactive' },
  ],
  carePlan: {
      tasks: [
          { id: 1, text: 'Check blood pressure daily at 8 AM', completed: true },
          { id: 2, text: 'Walk for 30 minutes, 5 times a week', completed: false },
          { id: 3, text: 'Log meals in nutrition app', completed: false },
      ],
      medications: [
          { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', completed: true },
          { id: 2, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', completed: false },
      ]
  },
  analytics: {
    monthlyData: [
        { month: 'Jan', fastingSugar: 98, postMealSugar: 135, systolic: 118, diastolic: 78, ldl: 105, hdl: 55 }, { month: 'Feb', fastingSugar: 102, postMealSugar: 145, systolic: 120, diastolic: 80, ldl: 110, hdl: 53 }, { month: 'Mar', fastingSugar: 95, postMealSugar: 130, systolic: 115, diastolic: 75, ldl: 100, hdl: 58 }, { month: 'Apr', fastingSugar: 105, postMealSugar: 150, systolic: 122, diastolic: 81, ldl: 115, hdl: 50 }, { month: 'May', fastingSugar: 99, postMealSugar: 140, systolic: 119, diastolic: 79, ldl: 108, hdl: 54 }, { month: 'Jun', fastingSugar: 110, postMealSugar: 160, systolic: 125, diastolic: 85, ldl: 120, hdl: 48 },
    ],
    vitals: { heartRate: 72, bloodPressure: '125/85', bloodSugar: 110, steps: 8200, sleep: 7.5 },
    recentActivity: [
        { id: 1, type: 'New Report', description: 'Blood Test results added by Dr. Smith.', date: '2025-07-15' }, { id: 2, type: 'Data Sync', description: 'Wearable data synced successfully.', date: '2025-07-14' }, { id: 3, type: 'Access Grant', description: 'Access granted to City Hospital Research.', date: '2025-07-10' },
    ]
  }
};
const mockProviderData = {
  name: 'Dr. Evelyn Reed', id: 'DOC-98765', email: 'e.reed@health.org', phone: '+1 987 654 321', specialty: 'Cardiology', hospital: 'General Hospital',
  licenseNumber: 'MD12345678', qualifications: ['MD, Cardiology', 'FACC'], yearsOfExperience: 15,
  patients: [ 
      { id: 'PID-23BCE1369', name: 'Alex Doe', status: 'Warning', lastCheckup: '2025-07-15', lastVitals: {hr: 78, bp: '130/88'}}, 
      { id: 'PID-83451', name: 'Ben Carter', status: 'Stable', lastCheckup: '2025-07-12', lastVitals: {hr: 68, bp: '118/78'}}, 
      { id: 'PID-19283', name: 'Chloe Davis', status: 'Critical', lastCheckup: '2025-07-11', lastVitals: {hr: 95, bp: '145/92'}},
      { id: 'PID-45678', name: 'David Evans', status: 'Stable', lastCheckup: '2025-07-18', lastVitals: {hr: 72, bp: '120/80'}}
    ],
  aiInsights: [ { id:1, insight: "Anomalous heart rate pattern detected for Chloe Davis.", level: "Critical", patientId: 'PID-19283' }, { id:2, insight: "Risk of Type-2 Diabetes has increased by 8% for Alex Doe.", level: "Warning", patientId: 'PID-23BCE1369' }, { id:3, insight: "Ben Carter's activity levels are consistently above average.", level: "Positive", patientId: 'PID-83451' } ],
  appointments: [
    { id: 1, patientName: 'Chloe Davis', time: '09:00 AM', reason: 'Urgent Follow-up' },
    { id: 2, patientName: 'Alex Doe', time: '10:30 AM', reason: 'Medication Review' },
    { id: 3, patientName: 'Ben Carter', time: '02:00 PM', reason: 'Annual Physical' },
  ],
  stats: { patientCount: 42, recordsAccessed: 157, aiAlerts: 3 }
};
const mockAdminData = {
    name: 'Admin',
    type: 'admin',
    stats: {
        totalUsers: 152,
        totalPatients: 110,
        totalProviders: 42,
        securedRecords: 873,
        aiAnalyses: 2451
    },
    allPatients: [
        { name: 'Alex Doe', id: 'PID-23BCE1369', email: 'alex.doe@email.com' },
        { name: 'Ben Carter', id: 'PID-83451', email: 'ben.c@email.com' },
        { name: 'Chloe Davis', id: 'PID-19283', email: 'chloe.d@email.com' },
    ],
    allProviders: [
        { name: 'Dr. Evelyn Reed', id: 'DOC-98765', email: 'e.reed@health.org' },
        { name: 'Dr. John Smith', id: 'DOC-12345', email: 'j.smith@health.org' }
    ]
};


// --- REUSABLE COMPONENTS ---
const GlassCard = ({ children, className = '' }) => {
  const { theme } = useContext(ThemeContext);
  return <div className={`border rounded-2xl p-4 sm:p-6 transition-all duration-300 ${theme.glass} ${className}`}>{children}</div>;
};
const AnimatedButton = ({ children, onClick, className = '', icon: Icon, disabled = false }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <button onClick={onClick} disabled={disabled} className={`relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-semibold rounded-lg group ${theme.primary} ${theme.primaryText} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}>
      <span className="absolute top-0 left-0 w-full h-full opacity-0 transition-all duration-300 ease-out transform -translate-x-full bg-white group-hover:opacity-20 group-hover:translate-x-0"></span>
      <span className="relative flex items-center gap-2">
        {Icon && <Icon size={20} className={disabled ? "animate-spin" : ""} />}
        {children}
      </span>
    </button>
  );
};
const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-lg transition-colors duration-300 ${theme.secondary} ${theme.secondaryText} hover:bg-opacity-80`}><Palette size={20} /></button>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-xl py-1 ${theme.secondary} ${theme.accent} border z-50`}>
          {Object.values(themes).map((t) => (
            <a key={t.name} href="#" onClick={(e) => { e.preventDefault(); setTheme(t); setIsOpen(false); }} className={`block px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}>{t.name}</a>
          ))}
        </div>
      )}
    </div>
  );
};
const FormInput = ({ icon: Icon, type = "text", placeholder, name, value, onChange, theme, children }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className={`w-5 h-5 ${theme.text} opacity-50`} />
        </span>
        {children || <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} className={`w-full p-3 pl-10 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} />}
    </div>
);


// --- HEADER COMPONENT ---
const Header = ({ user, onLogout, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
        <header className={`p-4 flex justify-between items-center sticky top-0 z-40 ${theme.glass}`}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                <BrainCircuit className={`w-8 h-8 text-blue-400`} />
                <h1 className={`text-xl font-bold tracking-tighter ${theme.text}`}>AuraHealth</h1>
            </div>
            <div className="flex items-center gap-4">
                {user.type !== 'admin' && <AnimatedButton onClick={() => onNavigate('symptom-checker')} icon={MessageSquare} className="px-4 py-2 text-sm">Symptom Checker</AnimatedButton>}
                <ThemeSwitcher />
                <button className={`p-2 rounded-lg transition-colors duration-300 ${theme.secondary} ${theme.secondaryText} hover:bg-opacity-80`}><Bell size={20} /></button>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${theme.secondary} ${theme.secondaryText} hover:bg-opacity-80`}>
                        <User size={20} />
                        <span className="hidden sm:inline font-medium">{user.name}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 ${theme.secondary} ${theme.accent} border z-50`}>
                             {user.type !== 'admin' && <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('profile'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><Settings size={16}/> Profile</a>}
                            {user.type === 'patient' && (
                                <>
                                    <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('appointments'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><CalendarPlus size={16}/> Appointments</a>
                                    <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('care-plan'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><ListTodo size={16}/> Care Plan</a>
                                    <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('my-records'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><FileText size={16}/> My Records</a>
                                    <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('permissions'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><Lock size={16}/> Permissions</a>
                                </>
                            )}
                             {user.type !== 'admin' && <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('analyzer'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><Sparkles size={16}/> AI Tools</a>}
                            <a href="#" onClick={onLogout} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><LogOut size={16}/> Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


// --- ONBOARDING FORMS ---
const PatientOnboardingForm = ({ user, onComplete, theme }) => {
    const [formData, setFormData] = useState({ dob: '', gender: '', bloodGroup: '', allergies: '', chronicConditions: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete({ ...user, ...formData });
    };
    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg}`}>
            <GlassCard className="w-full max-w-lg">
                <h1 className={`text-3xl font-bold text-center mb-2 ${theme.text}`}>Complete Your Profile</h1>
                <p className={`text-center opacity-70 mb-6 ${theme.text}`}>Please provide some essential health information to get started.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput icon={Cake} type="date" name="dob" value={formData.dob} onChange={handleChange} theme={theme} />
                        <FormInput icon={VenetianMask} theme={theme} name="gender">
                             <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full p-3 pl-10 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                <option value="" className={`${theme.bg} opacity-50`}>Select Gender...</option>
                                <option value="Male" className={`${theme.bg}`}>Male</option>
                                <option value="Female" className={`${theme.bg}`}>Female</option>
                                <option value="Other" className={`${theme.bg}`}>Other</option>
                            </select>
                        </FormInput>
                    </div>
                     <FormInput icon={TestTube} theme={theme} name="bloodGroup">
                           <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={`w-full p-3 pl-10 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                <option value="" className={`${theme.bg} opacity-50`}>Select Blood Group...</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg} className={`${theme.bg}`}>{bg}</option>)}
                            </select>
                    </FormInput>
                    <FormInput icon={Pill} type="text" placeholder="Known Allergies (comma-separated)" name="allergies" value={formData.allergies} onChange={handleChange} theme={theme} />
                    <FormInput icon={Stethoscope} type="text" placeholder="Chronic Conditions (comma-separated)" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} theme={theme} />

                    <div className="pt-4"><AnimatedButton type="submit" className="w-full" icon={CheckCircle}>Save & Continue</AnimatedButton></div>
                </form>
            </GlassCard>
        </div>
    );
};
const ProviderOnboardingForm = ({ user, onComplete, theme }) => {
     const [formData, setFormData] = useState({ licenseNumber: '', specialty: '', qualifications: '', yearsOfExperience: '' });
     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
     const handleSubmit = (e) => {
        e.preventDefault();
        onComplete({ ...user, ...formData });
    };
    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg}`}>
            <GlassCard className="w-full max-w-lg">
                <h1 className={`text-3xl font-bold text-center mb-2 ${theme.text}`}>Complete Your Professional Profile</h1>
                <p className={`text-center opacity-70 mb-6 ${theme.text}`}>Please provide your professional credentials.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <FormInput icon={FileText} type="text" placeholder="Medical License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} theme={theme} />
                     <FormInput icon={Award} type="text" placeholder="Specialization (e.g., Cardiology)" name="specialty" value={formData.specialty} onChange={handleChange} theme={theme} />
                     <FormInput icon={GraduationCap} type="text" placeholder="Qualifications (comma-separated, e.g., MD, FACC)" name="qualifications" value={formData.qualifications} onChange={handleChange} theme={theme} />
                     <FormInput icon={Calendar} type="number" placeholder="Years of Experience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} theme={theme} />
                    <div className="pt-4"><AnimatedButton type="submit" className="w-full" icon={CheckCircle}>Save & Continue</AnimatedButton></div>
                </form>
            </GlassCard>
        </div>
    );
};


// --- PAGE COMPONENTS & WIDGETS ---
const SendReportCard = ({ providerName, patientId, theme, onReportSent }) => {
    const [file, setFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [reportType, setReportType] = useState('Blood Test');
    
    const generateMockHash = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const hash = '0x' + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        return hash;
    };

    const handleSendReport = async () => {
        if (!file) return;
        setIsSending(true);
        const hash = await generateMockHash();
        const newReport = {
            id: Date.now(),
            type: reportType,
            date: new Date().toISOString().split('T')[0],
            doctor: providerName,
            file: file.name,
            blockchainHash: hash
        };
        onReportSent(newReport);
        setIsSending(false);
        setFile(null);
    };

    return (
        <GlassCard>
            <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Send Secure Report</h3>
            <div className="space-y-4">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className={`w-full text-sm ${theme.text} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} />
                <input type="text" value={reportType} onChange={e => setReportType(e.target.value)} placeholder="Report Type (e.g., MRI Scan)" className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                <AnimatedButton onClick={handleSendReport} disabled={!file || isSending} icon={isSending ? Loader2 : Send} className="w-full">
                    {isSending ? 'Sending & Hashing...' : 'Send Report'}
                </AnimatedButton>
            </div>
        </GlassCard>
    );
};
const ManageCarePlanCard = ({ patient, theme, onUpdateCarePlan }) => {
    const [newTask, setNewTask] = useState('');
    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });

    const handleAddTask = () => {
        if(!newTask.trim()) return;
        const updatedTasks = [...patient.carePlan.tasks, { id: Date.now(), text: newTask, completed: false }];
        onUpdateCarePlan({ ...patient.carePlan, tasks: updatedTasks });
        setNewTask('');
    };

    const handleAddMed = () => {
        if(!newMed.name.trim() || !newMed.dosage.trim() || !newMed.frequency.trim()) return;
        const updatedMeds = [...patient.carePlan.medications, { id: Date.now(), ...newMed, completed: false }];
        onUpdateCarePlan({ ...patient.carePlan, medications: updatedMeds });
        setNewMed({ name: '', dosage: '', frequency: '' });
    };

    return (
        <GlassCard>
            <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Manage Care Plan</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Add New Task</h4>
                    <div className="flex gap-2">
                        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="e.g., Check blood sugar" className={`flex-grow p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                        <AnimatedButton onClick={handleAddTask} icon={ClipboardPlus} className="px-4 py-2 text-sm" />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Prescribe Medication</h4>
                    <div className="space-y-2">
                        <input type="text" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} placeholder="Medication Name" className={`w-full p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                        <div className="flex gap-2">
                            <input type="text" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} placeholder="Dosage (e.g., 10mg)" className={`w-1/2 p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                            <input type="text" value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} placeholder="Frequency" className={`w-1/2 p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                        </div>
                         <AnimatedButton onClick={handleAddMed} icon={Pill} className="w-full mt-2 text-sm">Add Prescription</AnimatedButton>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
const PatientDetailViewForProvider = ({ patient, onBack, theme, providerName, onUpdatePatient }) => {
    const handleReportSent = (newReport) => {
        const updatedPatient = { ...patient, records: [...patient.records, newReport] };
        onUpdatePatient(updatedPatient);
    };

    const handleUpdateCarePlan = (newCarePlan) => {
        const updatedPatient = { ...patient, carePlan: newCarePlan };
        onUpdatePatient(updatedPatient);
    };

    return (
        <div className="p-6">
            <AnimatedButton onClick={onBack} className="mb-4">Back to Dashboard</AnimatedButton>
            <PatientProfilePage user={patient} isViewOnly={true}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <PatientDashboard user={patient} isViewOnly={true}/>
                </div>
                 <div className="space-y-6">
                    <ManageCarePlanCard patient={patient} theme={theme} onUpdateCarePlan={handleUpdateCarePlan} />
                    <SendReportCard providerName={providerName} patientId={patient.id} theme={theme} onReportSent={handleReportSent} />
                </div>
            </div>
        </div>
    );
};
const ProviderDashboard = ({ user, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPatients = user.patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const getStatusColor = (status) => {
        if (status === 'Critical') return 'bg-red-500';
        if (status === 'Warning') return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${theme.text}`}>Welcome back, {user.name}!</h1>
                <p className={`opacity-80 ${theme.text}`}>Here is your dashboard for today.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard><h4 className="font-bold">Total Patients</h4><p className="text-3xl font-bold">{user.stats.patientCount}</p></GlassCard>
                <GlassCard><h4 className="font-bold">Upcoming Appointments</h4><p className="text-3xl font-bold">{user.appointments.length}</p></GlassCard>
                <GlassCard><h4 className="font-bold">Critical AI Alerts</h4><p className="text-3xl font-bold">{user.aiInsights.filter(i => i.level === 'Critical').length}</p></GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard>
                    <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>AI-Powered Alerts</h3>
                    <div className="space-y-3">
                        {user.aiInsights.map(insight => (
                            <div key={insight.id} className={`p-3 rounded-lg flex items-center gap-3 ${getStatusColor(insight.level)} bg-opacity-20`}>
                                <div className={`w-3 h-3 rounded-full ${getStatusColor(insight.level)}`}></div>
                                <div>
                                    <p className={`font-semibold ${theme.text}`}>{insight.insight}</p>
                                    <button onClick={() => onNavigate('view-patient', insight.patientId)} className="text-sm text-blue-400 hover:underline">View Patient</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
                 <GlassCard>
                    <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Today's Appointments</h3>
                    <div className="space-y-3">
                        {user.appointments.map(apt => (
                            <div key={apt.id} className={`p-3 rounded-lg flex items-center justify-between ${theme.secondary}`}>
                                <div>
                                    <p className="font-semibold">{apt.patientName}</p>
                                    <p className="text-sm opacity-70">{apt.reason}</p>
                                </div>
                                <p className="font-bold">{apt.time}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-bold ${theme.text}`}>Your Patients</h3>
                     <div className="relative">
                        <input type="text" placeholder="Search patients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full p-2 pl-10 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.accent} ${theme.text}`} />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50"/>
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto pr-2">
                    {filteredPatients.map(p => (
                         <div key={p.id} onClick={() => onNavigate('view-patient', p.id)} className={`p-3 mb-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-700 ${theme.secondary}`}>
                             <div>
                                <p className="font-semibold">{p.name} <span className="opacity-60 text-sm">({p.id})</span></p>
                                <p className="text-sm opacity-70">Last Checkup: {p.lastCheckup}</p>
                             </div>
                             <div className="flex items-center gap-4">
                                <p className="text-sm">HR: {p.lastVitals.hr} | BP: {p.lastVitals.bp}</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(p.status)}`}></div>
                                    <span>{p.status}</span>
                                </div>
                             </div>
                         </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};
const ProviderProfilePage = ({ user }) => {
    const { theme } = useContext(ThemeContext);
    
    const qualificationsArray = Array.isArray(user.qualifications) 
    ? user.qualifications 
    : (user.qualifications || '').split(',').map(q => q.trim()).filter(Boolean);

    return (
        <div className="p-6">
            <GlassCard>
                 <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center text-5xl font-bold ${theme.primaryText}`}>{user.name.charAt(0)}</div>
                        <div>
                            <h1 className={`text-4xl font-bold ${theme.text}`}>{user.name}</h1>
                            <p className={`text-lg opacity-80 ${theme.text}`}>{user.id}</p>
                        </div>
                    </div>
                    <AnimatedButton icon={Settings}>Edit Profile</AnimatedButton>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><Award /> Specialization</h3><p>{user.specialty}</p></GlassCard>
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><GraduationCap /> Qualifications</h3><div className="flex flex-wrap gap-2">{qualificationsArray.map(q => <span key={q} className={`px-3 py-1 text-sm rounded-full ${theme.secondary} ${theme.secondaryText}`}>{q}</span>)}</div></GlassCard>
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><FileText /> License</h3><p>{user.licenseNumber}</p></GlassCard>
                </div>
            </GlassCard>
        </div>
    );
};

// --- PATIENT PROFILE PAGE ---
const PatientProfilePage = ({ user, isViewOnly = false }) => {
    const { theme } = useContext(ThemeContext);

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleDownloadPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(22); doc.text("AuraHealth Patient Profile", 14, 22);
        doc.setFontSize(16); doc.text(`Patient: ${user.name}`, 14, 32);
        doc.setFontSize(12); doc.text(`ID: ${user.id}`, 14, 38);
        let y = 50;
        doc.setFontSize(14); doc.text("Personal Details", 14, y); y += 7;
        doc.setFontSize(11); doc.text(`- Age: ${calculateAge(user.dob)}`, 16, y); y+=6; doc.text(`- Gender: ${user.gender || 'N/A'}`, 16, y); y+=6; doc.text(`- Blood Group: ${user.bloodGroup || 'N/A'}`, 16, y); y+=6; doc.text(`- Contact: ${user.email} | ${user.phone}`, 16, y); y+=10;
        doc.setFontSize(14); doc.text("Health Conditions", 14, y); y += 7;
        doc.setFontSize(11); doc.text(`- Allergies: ${user.allergies?.join(', ') || 'None listed'}`, 16, y); y+=6; doc.text(`- Chronic Conditions: ${user.chronicConditions?.join(', ') || 'None listed'}`, 16, y); y+=10;
        doc.setFontSize(14); doc.text("Emergency Contact", 14, y); y += 7;
        doc.setFontSize(11); doc.text(`- Name: ${user.emergencyContact?.name || 'N/A'}`, 16, y); y+=6; doc.text(`- Relation: ${user.emergencyContact?.relation || 'N/A'}`, 16, y); y+=6; doc.text(`- Phone: ${user.emergencyContact?.phone || 'N/A'}`, 16, y);
        doc.save(`${user.name}_AuraHealth_Profile.pdf`);
    };

    const allergiesArray = Array.isArray(user.allergies) 
    ? user.allergies 
    : (user.allergies || '').split(',').map(q => q.trim()).filter(Boolean);

    const conditionsArray = Array.isArray(user.chronicConditions)
    ? user.chronicConditions
    : (user.chronicConditions || '').split(',').map(q => q.trim()).filter(Boolean);

    return (
        <div className="p-6">
            <GlassCard>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center text-5xl font-bold ${theme.primaryText}`}>{user.name.charAt(0)}</div>
                        <div><h1 className={`text-4xl font-bold ${theme.text}`}>{user.name}</h1><p className={`text-lg opacity-80 ${theme.text}`}>{user.id}</p></div>
                    </div>
                    {!isViewOnly && (<div className="flex gap-2"><AnimatedButton icon={Settings}>Edit Profile</AnimatedButton><AnimatedButton onClick={handleDownloadPdf} icon={Download}>Download PDF</AnimatedButton></div>)}
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><User /> Personal Details</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Age:</strong> {calculateAge(user.dob)}</p><p><strong className="opacity-70">Gender:</strong> {user.gender || 'N/A'}</p><p><strong className="opacity-70">Blood Group:</strong> {user.bloodGroup || 'N/A'}</p><p><strong className="opacity-70">Email:</strong> {user.email}</p><p><strong className="opacity-70">Phone:</strong> {user.phone}</p></div></GlassCard>
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><Stethoscope /> Health Conditions</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Allergies:</strong></p><div className="flex flex-wrap gap-2">{allergiesArray.map(allergy => <span key={allergy} className={`px-3 py-1 text-sm rounded-full ${theme.primary} ${theme.primaryText}`}>{allergy}</span>) }</div><p className="mt-2"><strong className="opacity-70">Chronic Conditions:</strong></p><div className="flex flex-wrap gap-2">{conditionsArray.map(cond => <span key={cond} className={`px-3 py-1 text-sm rounded-full ${theme.secondary} ${theme.secondaryText}`}>{cond}</span>)}</div></div></GlassCard>
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><AlertTriangle /> Emergency Contact</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Name:</strong> {user.emergencyContact?.name || 'N/A'}</p><p><strong className="opacity-70">Relation:</strong> {user.emergencyContact?.relation || 'N/A'}</p><p><strong className="opacity-70">Phone:</strong> {user.emergencyContact?.phone || 'N/A'}</p></div></GlassCard>
                </div>
            </GlassCard>
        </div>
    );
};

// --- APPOINTMENTS PAGE ---
const AppointmentPage = ({ user, theme, onUpdateAppointments }) => {
    const [showScheduler, setShowScheduler] = useState(false);
    const handleSchedule = (newAppointment) => {
        const updatedAppointments = [...user.appointments, { ...newAppointment, id: user.appointments.length + 1 }];
        onUpdateAppointments(updatedAppointments);
        setShowScheduler(false);
    };
    return (
        <div className="p-6 space-y-6">
             <div className="flex justify-between items-center"><h1 className={`text-3xl font-bold ${theme.text}`}>Your Appointments</h1><AnimatedButton onClick={() => setShowScheduler(true)} icon={CalendarPlus}>Schedule New</AnimatedButton></div>
            <GlassCard><h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Upcoming Appointments</h3><div className="space-y-3">{user.appointments.length > 0 ? user.appointments.map(apt => (<div key={apt.id} className={`p-4 rounded-lg flex items-center justify-between ${theme.secondary}`}><div><p className="font-semibold text-lg">{apt.providerName}</p><p className="text-sm opacity-70">{apt.reason}</p></div><div><p className="font-bold text-lg">{apt.date}</p><p className="text-sm opacity-70 text-right">{apt.time}</p></div></div>)) : <p className="opacity-70">No upcoming appointments.</p>}</div></GlassCard>
            {showScheduler && <AppointmentScheduler user={user} theme={theme} onSchedule={handleSchedule} onClose={() => setShowScheduler(false)} />}
        </div>
    );
};
const AppointmentScheduler = ({ user, theme, onSchedule, onClose }) => {
    const [selectedProvider, setSelectedProvider] = useState(user.providers[0]?.id || '');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];
    const handleSubmit = (e) => { e.preventDefault(); const provider = user.providers.find(p => p.id === selectedProvider); onSchedule({ providerName: provider.name, date: selectedDate, time: selectedTime, reason: "Consultation" }); };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <GlassCard className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-4"><h2 className={`text-2xl font-bold ${theme.text}`}>Schedule Appointment</h2><button onClick={onClose} className={`p-2 rounded-lg ${theme.secondary} hover:opacity-80`}><X size={20} /></button></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className={`block mb-2 font-semibold ${theme.text}`}>Select Provider</label><select value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}><option value="" disabled className={`${theme.bg}`}>Select a provider</option>{user.providers.map(p => <option key={p.id} value={p.id} className={`${theme.bg}`}>{p.name} - {p.specialty}</option>)}</select></div>
                     <div><label className={`block mb-2 font-semibold ${theme.text}`}>Select Date</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} /></div>
                     <div><label className={`block mb-2 font-semibold ${theme.text}`}>Select Time</label><div className="grid grid-cols-3 gap-2">{timeSlots.map(time => (<button key={time} type="button" onClick={() => setSelectedTime(time)} className={`p-2 rounded-lg text-center font-semibold transition-colors duration-200 ${selectedTime === time ? `${theme.primary} ${theme.primaryText}` : `${theme.secondary} ${theme.secondaryText}`}`}>{time}</button>))}</div></div>
                    <div className="text-right pt-4"><AnimatedButton type="submit" disabled={!selectedProvider || !selectedDate || !selectedTime}>Confirm Appointment</AnimatedButton></div>
                </form>
            </GlassCard>
        </div>
    );
};

// --- MY RECORDS PAGE (Patient) ---
const MyRecordsPage = ({ user, theme }) => {
    return (
        <div className="p-6">
            <GlassCard>
                <h1 className={`text-3xl font-bold mb-4 ${theme.text}`}>My Medical Records</h1>
                <p className={`mb-6 opacity-80 ${theme.text}`}>All your documents are secured and verified on the blockchain.</p>
                <div className="space-y-3">
                    {user.records.map(record => (
                        <div key={record.id} className={`p-4 rounded-lg ${theme.secondary}`}>
                           <div className="flex justify-between items-center">
                               <div>
                                   <p className="font-semibold text-lg">{record.type}</p>
                                   <p className="text-sm opacity-70">From: {record.doctor} on {record.date}</p>
                               </div>
                               <AnimatedButton className="px-4 py-2 text-sm" icon={Download}>Download</AnimatedButton>
                           </div>
                           <div className="mt-2 flex items-center gap-2 text-xs opacity-60 break-all">
                                <ShieldCheck size={14} className="text-green-400 flex-shrink-0" />
                                <p>Hash: {record.blockchainHash}</p>
                           </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    )
};

// --- NEW FEATURE PAGES ---
const PermissionsPage = ({ user, theme, onUpdatePermissions }) => {
    const handleScopeChange = (id, newScope) => {
        const updatedPermissions = user.permissions.map(p => p.id === id ? { ...p, scope: newScope } : p);
        onUpdatePermissions(updatedPermissions);
    };

    const handleStatusToggle = (id) => {
        const updatedPermissions = user.permissions.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p);
        onUpdatePermissions(updatedPermissions);
    };

    return (
        <div className="p-6">
            <GlassCard>
                <h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}><Lock /> Access & Permissions</h1>
                <p className={`mb-6 opacity-80 ${theme.text}`}>Manage who can access your health data. These permissions are enforced by secure smart contracts on the blockchain.</p>
                <div className="space-y-3">
                    {user.permissions.map(p => (
                        <div key={p.id} className={`p-4 rounded-lg ${theme.secondary}`}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                <div className="md:col-span-1">
                                    <p className="font-semibold text-lg">{p.grantee}</p>
                                    <p className={`text-sm ${p.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{p.status}</p>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="text-xs opacity-70">Scope</label>
                                    <select value={p.scope} onChange={(e) => handleScopeChange(p.id, e.target.value)} className={`w-full p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-1`}>
                                        <option className={theme.bg}>Full Record</option>
                                        <option className={theme.bg}>Vitals Only</option>
                                        <option className={theme.bg}>Anonymized Vitals</option>
                                        <option className={theme.bg}>Lab Reports Only</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <p className="text-xs opacity-70">Duration</p>
                                    <p>{p.duration}</p>
                                </div>
                                <div className="md:col-span-1 flex justify-end">
                                    <AnimatedButton onClick={() => handleStatusToggle(p.id)} className={`px-4 py-2 text-sm ${p.status === 'Active' ? 'bg-red-600' : 'bg-green-600'}`}>
                                        {p.status === 'Active' ? 'Revoke' : 'Activate'}
                                    </AnimatedButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};
const CarePlanPage = ({ user, theme, onUpdateCarePlan }) => {
    const { tasks, medications } = user.carePlan;

    const handleToggleTask = (taskId) => {
        const updatedTasks = tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t);
        onUpdateCarePlan({ tasks: updatedTasks, medications });
    };

    const handleToggleMed = (medId) => {
        const updatedMeds = medications.map(m => m.id === medId ? {...m, completed: !m.completed} : m);
        onUpdateCarePlan({ tasks, medications: updatedMeds });
    };

    return (
        <div className="p-6">
            <GlassCard>
                <h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}><ListTodo /> My Care Plan</h1>
                <p className={`mb-6 opacity-80 ${theme.text}`}>Follow the plan created by your provider to stay on track with your health goals.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassCard>
                        <h3 className="text-xl font-bold mb-4">Daily Tasks</h3>
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className={`p-3 rounded-lg flex items-center gap-3 transition-all ${task.completed ? 'opacity-50' : ''} ${theme.secondary}`}>
                                    <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} className="w-5 h-5 rounded accent-blue-500"/>
                                    <label className={`${task.completed ? 'line-through' : ''}`}>{task.text}</label>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                    <GlassCard>
                        <h3 className="text-xl font-bold mb-4">Medication Schedule</h3>
                        <div className="space-y-3">
                            {medications.map(med => (
                                <div key={med.id} className={`p-3 rounded-lg flex items-center gap-3 transition-all ${med.completed ? 'opacity-50' : ''} ${theme.secondary}`}>
                                    <input type="checkbox" checked={med.completed} onChange={() => handleToggleMed(med.id)} className="w-5 h-5 rounded accent-blue-500"/>
                                    <div>
                                        <p className={`font-semibold ${med.completed ? 'line-through' : ''}`}>{med.name}</p>
                                        <p className="text-sm opacity-70">{med.dosage} - {med.frequency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </GlassCard>
        </div>
    );
};
const SymptomCheckerPage = ({ theme }) => {
    const [messages, setMessages] = useState([{ sender: 'ai', text: "Hello! I'm your AI Symptom Checker. Please describe your main symptom to get started (e.g., 'I have a sore throat')." }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const userMessage = { sender: 'user', text: input };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInput('');
        setIsLoading(true);

        const prompt = `You are a friendly and helpful AI symptom checker. A user has sent the following message: "${input}". Your previous conversation history is: ${JSON.stringify(messages)}. Based on this, ask a single, clear follow-up question to better understand their condition, or if you have enough information, provide a brief preliminary analysis with potential conditions and recommend next steps (e.g., rest, see a doctor). Keep your response concise.`;
        
        try {
            let chatHistory = [];
            currentMessages.forEach(msg => {
                chatHistory.push({ role: msg.sender === 'ai' ? "model" : "user", parts: [{ text: msg.text }] });
            });

            const payload = { contents: chatHistory };
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            let aiResponseText = "I'm having trouble processing that. Could you please rephrase?";
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                aiResponseText = result.candidates[0].content.parts[0].text;
            }

            const aiResponse = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiResponse]);

        } catch (error) {
            console.error("Gemini API error:", error);
            const errorResponse = { sender: 'ai', text: "Sorry, I encountered an error. Please try again later." };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <GlassCard className="h-[80vh] flex flex-col">
                <h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}><MessageSquare /> AI Symptom Checker</h1>
                <p className={`mb-4 opacity-80 ${theme.text}`}>This tool offers preliminary insights and is not a substitute for professional medical advice.</p>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.primary} ${theme.primaryText} flex-shrink-0`}><Sparkles size={16}/></div>}
                            <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? `${theme.primary} ${theme.primaryText}` : `${theme.secondary} ${theme.secondaryText}`}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><Loader2 className={`w-8 h-8 animate-spin ml-12 ${theme.text}`} /></div>}
                     <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className={`flex-grow p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} disabled={isLoading}/>
                    <AnimatedButton type="submit" icon={Send} disabled={isLoading || !input.trim()}>Send</AnimatedButton>
                </form>
            </GlassCard>
        </div>
    );
};
const AdminDashboard = ({ user, theme }) => {
    const [patientSearch, setPatientSearch] = useState('');
    const [providerSearch, setProviderSearch] = useState('');

    const filteredPatients = user.allPatients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.id.toLowerCase().includes(patientSearch.toLowerCase()));
    const filteredProviders = user.allProviders.filter(p => p.name.toLowerCase().includes(providerSearch.toLowerCase()) || p.id.toLowerCase().includes(providerSearch.toLowerCase()));

    const StatCard = ({ label, value, icon: Icon }) => (
        <GlassCard className="flex items-center gap-4">
            <Icon className={`w-8 h-8 ${theme.primaryText}`} />
            <div>
                <p className={`text-lg font-semibold opacity-80 ${theme.text}`}>{label}</p>
                <p className={`text-3xl font-bold ${theme.text}`}>{value.toLocaleString()}</p>
            </div>
        </GlassCard>
    );

    const UserTable = ({ title, users, searchTerm, setSearchTerm }) => (
        <GlassCard className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${theme.text}`}>{title}</h3>
                <div className="relative">
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full p-2 pl-10 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.accent} ${theme.text}`} />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                </div>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="space-y-2">
                    {users.map(u => (
                        <div key={u.id} className={`p-3 rounded-lg flex justify-between items-center ${theme.secondary}`}>
                            <div>
                                <p className="font-semibold">{u.name}</p>
                                <p className="text-sm opacity-60">{u.id}</p>
                            </div>
                            <p className="text-sm opacity-80">{u.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${theme.text}`}>Admin Console</h1>
                <p className={`opacity-80 ${theme.text}`}>Live platform statistics and user management.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard label="Total Users" value={user.stats.totalUsers} icon={Users} />
                <StatCard label="Total Patients" value={user.stats.totalPatients} icon={User} />
                <StatCard label="Total Providers" value={user.stats.totalProviders} icon={Stethoscope} />
                <StatCard label="Secured Records" value={user.stats.securedRecords} icon={ShieldCheck} />
                <StatCard label="AI Analyses" value={user.stats.aiAnalyses} icon={BrainCircuit} />
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <UserTable title="All Patients" users={filteredPatients} searchTerm={patientSearch} setSearchTerm={setPatientSearch} />
                <UserTable title="All Providers" users={filteredProviders} searchTerm={providerSearch} setSearchTerm={setProviderSearch} />
            </div>
        </div>
    );
};


// --- PATIENT DASHBOARD COMPONENTS ---
const VitalSignCard = ({ icon: Icon, label, value, unit, colorClass }) => {
    const { theme } = useContext(ThemeContext);
    return (<GlassCard className="flex items-center gap-4"><div className={`p-3 rounded-full ${colorClass}`}><Icon className="w-6 h-6 text-white" /></div><div><p className={`text-sm opacity-80 ${theme.text}`}>{label}</p><p className={`text-2xl font-bold ${theme.text}`}>{value} <span className="text-base font-normal">{unit}</span></p></div></GlassCard>);
};
const AnalyticsChart = ({ data, theme, title, yKey1, yKey2, color1, color2, safeRange, warningRange }) => (
    <GlassCard>
        <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer><AreaChart data={data}><defs><linearGradient id={`color${yKey1}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color1} stopOpacity={0.8}/><stop offset="95%" stopColor={color1} stopOpacity={0}/></linearGradient>{yKey2 && <linearGradient id={`color${yKey2}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color2} stopOpacity={0.8}/><stop offset="95%" stopColor={color2} stopOpacity={0}/></linearGradient>}</defs><CartesianGrid strokeDasharray="3 3" stroke={theme.text} strokeOpacity={0.2} /><XAxis dataKey="month" stroke={theme.text} tick={{ fill: theme.text, fontSize: 12 }} /><YAxis stroke={theme.text} tick={{ fill: theme.text, fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: theme.glass, border: 'none', color: theme.text }} /><Legend wrapperStyle={{color: theme.text}}/><ReferenceArea y1={warningRange[1]} y2={300} fill="red" fillOpacity={0.1} label={{ value: 'Danger', position: 'insideTopRight', fill: 'red', fontSize: 10 }} /><ReferenceArea y1={safeRange[1]} y2={warningRange[1]} fill="yellow" fillOpacity={0.1} label={{ value: 'Warning', position: 'insideTopRight', fill: 'yellow', fontSize: 10 }}/><ReferenceArea y1={safeRange[0]} y2={safeRange[1]} fill="green" fillOpacity={0.1} label={{ value: 'Safe', position: 'insideTopRight', fill: 'green', fontSize: 10 }}/><Area type="monotone" dataKey={yKey1} stroke={color1} fillOpacity={1} fill={`url(#color${yKey1})`} name={yKey1.replace(/([A-Z])/g, ' $1').trim()} />{yKey2 && <Area type="monotone" dataKey={yKey2} stroke={color2} fillOpacity={1} fill={`url(#color${yKey2})`} name={yKey2.replace(/([A-Z])/g, ' $1').trim()} />}</AreaChart></ResponsiveContainer>
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
    const getWellnessPlan = async () => { setIsLoading(true); setError(''); setWellnessPlan(null); setShowModal(true); const healthDataSummary = `Latest Vitals: ${JSON.stringify(user.analytics.vitals)}. Last 6 Months Trends: ${JSON.stringify(user.analytics.monthlyData)}.`; const prompt = `Based on the following health data, generate a personalized wellness plan. The user's data shows some trends towards high blood sugar and cholesterol. Provide actionable, simple advice. Return a JSON object with three keys: 'dietarySuggestions', 'exerciseRecommendations', and 'generalAdvice'. Each key should contain an array of short, clear strings.`; try { const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", } }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`API request failed: ${response.statusText}`); const result = await response.json(); if (result.candidates && result.candidates[0].content.parts[0].text) { setWellnessPlan(JSON.parse(result.candidates[0].content.parts[0].text)); } else { throw new Error("Invalid response from AI."); } } catch (err) { console.error("Gemini API Error:", err); setError("Failed to generate wellness plan. Please try again."); } finally { setIsLoading(false); } };
    return (<><GlassCard className="text-center"><h3 className={`text-2xl font-bold ${theme.text}`}>AI Wellness Coach</h3><p className={`mt-2 mb-4 opacity-80 ${theme.text}`}>Get a personalized wellness plan based on your latest health data.</p><AnimatedButton onClick={getWellnessPlan} icon={Sparkles}>✨ Get Wellness Plan</AnimatedButton></GlassCard>{showModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"><GlassCard className="w-full max-w-2xl"><div className="flex justify-between items-center mb-4"><h2 className={`text-2xl font-bold ${theme.text}`}>Your AI Wellness Plan</h2><button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${theme.secondary} hover:opacity-80`}><X size={20} /></button></div>{isLoading && <div className="flex justify-center items-center h-48"><Loader2 className={`w-12 h-12 animate-spin ${theme.text}`} /></div>}{error && <p className="text-red-500 text-center">{error}</p>}{wellnessPlan && (<div className={`space-y-4 max-h-[60vh] overflow-y-auto pr-2 ${theme.text}`}><div><h4 className={`font-bold text-lg mb-2 ${theme.text}`}>Dietary Suggestions</h4><ul className={`list-disc list-inside space-y-1 text-sm opacity-90 ${theme.text}`}>{wellnessPlan.dietarySuggestions.map((item, i) => <li key={`diet-${i}`}>{item}</li>)}</ul></div><div><h4 className={`font-bold text-lg mb-2 ${theme.text}`}>Exercise Recommendations</h4><ul className={`list-disc list-inside space-y-1 text-sm opacity-90 ${theme.text}`}>{wellnessPlan.exerciseRecommendations.map((item, i) => <li key={`exer-${i}`}>{item}</li>)}</ul></div><div><h4 className={`font-bold text-lg mb-2 ${theme.text}`}>General Advice</h4><ul className={`list-disc list-inside space-y-1 text-sm opacity-90 ${theme.text}`}>{wellnessPlan.generalAdvice.map((item, i) => <li key={`adv-${i}`}>{item}</li>)}</ul></div></div>)}</GlassCard></div>)}</>);
};
const PatientDashboard = ({ user, isViewOnly=false }) => {
    const { theme } = useContext(ThemeContext);
    const analytics = user.analytics;
    return (<div className="p-6 space-y-6">{!isViewOnly && (<div><h1 className={`text-3xl font-bold ${theme.text}`}>Welcome back, {user.name.split(' ')[0]}!</h1><p className={`opacity-80 ${theme.text}`}>Here's a summary of your health analytics.</p></div>)}<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"><div className="sm:col-span-2 lg:col-span-4"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><VitalSignCard icon={Heart} label="Heart Rate" value={analytics.vitals.heartRate} unit="bpm" colorClass="bg-red-500" /><VitalSignCard icon={Activity} label="Blood Pressure" value={analytics.vitals.bloodPressure} unit="mmHg" colorClass="bg-blue-500" /><VitalSignCard icon={Droplets} label="Blood Sugar" value={analytics.vitals.bloodSugar} unit="mg/dL" colorClass="bg-yellow-500" /><VitalSignCard icon={Footprints} label="Steps Today" value={analytics.vitals.steps.toLocaleString()} unit="steps" colorClass="bg-green-500" /></div></div>{!isViewOnly && <AIWellnessCoach user={user} theme={theme} />}</div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><AnalyticsChart data={analytics.monthlyData} theme={theme} title="Blood Sugar Trends (Post-Meal)" yKey1="postMealSugar" color1={theme.chartColor1} safeRange={[0, 140]} warningRange={[140, 200]} /><AnalyticsChart data={analytics.monthlyData} theme={theme} title="Blood Pressure Trends (Systolic)" yKey1="systolic" color1={theme.chartColor2} safeRange={[0, 120]} warningRange={[120, 140]} /><AnalyticsChart data={analytics.monthlyData} theme={theme} title="Cholesterol Trends (LDL)" yKey1="ldl" color1={theme.chartColor1} safeRange={[0, 100]} warningRange={[100, 160]} />{!isViewOnly && <RecentActivity activities={analytics.recentActivity} theme={theme} />}</div></div>);
};


// --- 3D MODEL COMPONENT ---
const Human3DModel = ({ highlightedParts, theme }) => {
    const mountRef = useRef(null);
    const bodyPartsRef = useRef({});
    const [isModelLoading, setIsModelLoading] = useState(true);
    useEffect(() => {
        const mountNode = mountRef.current; if (!mountNode) return; let renderer, animationFrameId; const init = () => { const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(50, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000); camera.position.set(0, 1.5, 6); renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setSize(mountNode.clientWidth, mountNode.clientHeight); renderer.setPixelRatio(window.devicePixelRatio); mountNode.appendChild(renderer.domElement); const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0, 1, 0); controls.enableDamping = true; controls.enableZoom = false; controls.enablePan = false; const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); scene.add(ambientLight); const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); directionalLight.position.set(5, 10, 7.5); scene.add(directionalLight); const loader = new GLTFLoader(); loader.load('https://threejs.org/examples/models/gltf/Soldier.glb', (gltf) => { const model = gltf.scene; model.scale.set(1.2, 1.2, 1.2); model.position.y = -1.5; scene.add(model); model.traverse((child) => { if (child.isMesh) { child.originalMaterial = child.material; bodyPartsRef.current['head'] = child; bodyPartsRef.current['torso'] = child; bodyPartsRef.current['arms'] = child; bodyPartsRef.current['legs'] = child; } }); const organMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.5, roughness: 0.5 }); const heart = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), organMaterial.clone()); heart.position.set(-0.1, 1.3, 0.2); bodyPartsRef.current['heart'] = heart; scene.add(heart); const pancreas = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.2, 4, 8), organMaterial.clone()); pancreas.position.set(0.1, 1.1, 0.15); pancreas.rotation.z = Math.PI / 4; bodyPartsRef.current['pancreas'] = pancreas; scene.add(pancreas); const liver = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.15), organMaterial.clone()); liver.position.set(0.25, 1.2, 0.2); bodyPartsRef.current['liver'] = liver; scene.add(liver); setIsModelLoading(false); }, undefined, (error) => { console.error('An error happened while loading the model:', error); setIsModelLoading(false); }); const animate = () => { animationFrameId = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }; animate(); }; const frameId = requestAnimationFrame(init); return () => { cancelAnimationFrame(frameId); cancelAnimationFrame(animationFrameId); if (renderer && mountNode && renderer.domElement) { mountNode.removeChild(renderer.domElement); } }; }, []);
    useEffect(() => { Object.values(bodyPartsRef.current).flat().forEach(part => { if(part.material && part.material.emissive) { part.material.emissive.set(0x000000); } }); if (highlightedParts && highlightedParts.length > 0) { highlightedParts.forEach(partName => { const parts = bodyPartsRef.current[partName]; if (parts) { (Array.isArray(parts) ? parts : [parts]).forEach(part => { if(part.material && part.material.emissive) { part.material.emissive.set(new THREE.Color(theme.chartColor1)); } }); } }); } }, [highlightedParts, theme]);
    return (<div className="relative w-full h-full min-h-[400px]">{isModelLoading && (<div className="absolute inset-0 flex items-center justify-center"><Loader2 className={`w-12 h-12 animate-spin ${theme.text}`} /></div>)}<div ref={mountRef} className="w-full h-full"></div></div>);
};

// --- AI ANALYZER COMPONENT ---
const AiReportAnalyzer = () => {
    const { theme } = useContext(ThemeContext);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [activeProblem, setActiveProblem] = useState(null);
    const handleFileChange = (e) => { const selectedFile = e.target.files[0]; if (!selectedFile) return; setFile(selectedFile); setAnalysis(null); setActiveProblem(null); setError(''); if (selectedFile.type.startsWith('image/')) setFilePreview(URL.createObjectURL(selectedFile)); else if (selectedFile.type === 'application/pdf') setFilePreview('pdf'); else { setError('Please upload a valid image or PDF file.'); setFile(null); setFilePreview(null); } };
    const handleAnalyze = async () => { if (!file) { setError('Please upload a file first.'); return; } setIsLoading(true); setError(''); setAnalysis(null); setActiveProblem(null); if (file.type === 'application/pdf') { setTimeout(() => { setAnalysis({ metrics: [ { metric: 'Glucose (Simulated)', value: '115 mg/dL', range: '70-100 mg/dL', interpretation: 'High' }, { metric: 'Cholesterol (Simulated)', value: '220 mg/dL', range: '<200 mg/dL', interpretation: 'High' }, ], summary: "The report indicates elevated glucose and cholesterol levels, suggesting a risk of pre-diabetes and potential cardiovascular strain. Other metrics appear within normal ranges.", problems: [ { problemName: "High Blood Glucose", explanation: "Elevated glucose levels may indicate insulin resistance or pre-diabetes, where the body struggles to regulate blood sugar effectively.", possibleCauses: ["High sugar/carb diet", "Lack of physical activity", "Genetics"], suggestedSolutions: ["Adopt a low-glycemic diet", "Increase regular exercise", "Consult a doctor about medication like Metformin"], affectedParts: ["pancreas", "liver"] }, { problemName: "High Cholesterol", explanation: "High cholesterol can lead to plaque buildup in arteries (atherosclerosis), increasing the risk of heart disease.", possibleCauses: ["Diet high in saturated/trans fats", "Sedentary lifestyle", "Smoking"], suggestedSolutions: ["Eat more soluble fiber (oats, fruits)", "Reduce red meat consumption", "Regular aerobic exercise"], affectedParts: ["heart", "torso"] } ] }); setIsLoading(false); }, 2000); return; } const reader = new FileReader(); reader.readAsDataURL(file); reader.onloadend = async () => { const base64ImageData = reader.result.split(',')[1]; const prompt = `Analyze this medical report image. Provide a JSON object with three keys: 'metrics', 'summary', and 'problems'. 1. 'metrics': An array of objects, each with 'metric', 'value', 'range', and 'interpretation'. 2. 'summary': A brief, 2-3 sentence overall summary of the findings. 3. 'problems': An array of objects for any abnormal findings. Each object should have 'problemName', 'explanation', 'possibleCauses' (array of strings), 'suggestedSolutions' (array of strings), and 'affectedParts' (array of relevant strings from this list: 'head', 'torso', 'heart', 'pancreas', 'liver', 'arms', 'legs').`; try { const payload = { contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: file.type, data: base64ImageData } }] }] }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`API request failed: ${response.statusText}`); const result = await response.json(); if (result.candidates && result.candidates[0].content.parts[0].text) { const text = result.candidates[0].content.parts[0].text; const cleanedJsonString = text.replace(/```json|```/g, '').trim(); setAnalysis(JSON.parse(cleanedJsonString)); } else throw new Error("Invalid response structure from API."); } catch (err) { console.error("API Error:", err); setError(`Analysis failed. ${err.message}. Please try again.`); } finally { setIsLoading(false); } }; };
    const getInterpretationColor = (interpretation) => { if (!interpretation) return theme.secondaryText; const lowerInterp = interpretation.toLowerCase(); if (lowerInterp === 'high' || lowerInterp === 'critical') return 'text-red-500'; if (lowerInterp === 'low') return 'text-yellow-500'; if (lowerInterp === 'normal') return 'text-green-500'; return theme.secondaryText; };
    return (<div className="p-6"><GlassCard><h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}><TestTube2 /> AI Report Analyzer</h1><p className={`mb-6 opacity-80 ${theme.text}`}>Upload a report (Image/PDF). The AI provides a detailed analysis, summary, and an interactive 3D visualization of affected areas. This is not a substitute for professional medical advice.</p><div className="grid lg:grid-cols-2 gap-6 items-start"><GlassCard className="h-full"><input type="file" accept="image/*,application/pdf" onChange={handleFileChange} ref={fileInputRef} className="hidden" /><div onClick={() => fileInputRef.current.click()} className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${theme.accent} hover:bg-opacity-20 hover:bg-slate-700`}>{filePreview === 'pdf' ? <div className='text-center'><FileJson size={48} className={`mb-4 mx-auto ${theme.text}`} /><p className={theme.text}>{file?.name}</p></div> : filePreview ? <img src={filePreview} alt="Report preview" className="w-full h-full object-contain rounded-lg" /> : <><UploadCloud size={48} className={`mb-4 ${theme.text}`} /><p className={theme.text}>Click to Upload Report</p><p className={`text-sm opacity-70 ${theme.text}`}>Image or PDF</p></>}</div><div className="mt-4 text-center"><AnimatedButton onClick={handleAnalyze} disabled={!file || isLoading} icon={isLoading ? Loader2 : Sparkles}>{isLoading ? 'Analyzing...' : 'Analyze Now'}</AnimatedButton></div>{error && <p className="text-red-500 text-center mt-4">{error}</p>}</GlassCard><GlassCard className="h-full"><h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>3D Visualization</h2><Human3DModel highlightedParts={activeProblem ? activeProblem.affectedParts : []} theme={theme} /></GlassCard></div>{isLoading && <div className="flex items-center justify-center h-48"><Loader2 size={48} className={`animate-spin ${theme.text}`} /></div>}{analysis && (<GlassCard className="mt-6"><h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>Analysis Results</h2><div className="mb-6"><h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>Summary</h3><p className={theme.text}>{analysis.summary}</p></div><div className="mb-6"><h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>Potential Problems</h3><div className="space-y-2">{analysis.problems.map((prob, index) => (<div key={index} className={`rounded-lg transition-all duration-300 ${theme.secondary}`}><button onClick={() => setActiveProblem(activeProblem?.problemName === prob.problemName ? null : prob)} className={`w-full flex justify-between items-center p-4 text-left font-semibold ${theme.secondaryText}`}><span>{prob.problemName}</span><ChevronsUpDown className={`transition-transform ${activeProblem?.problemName === prob.problemName ? 'rotate-180' : ''}`} /></button>{activeProblem?.problemName === prob.problemName && (<div className={`p-4 border-t border-slate-700/50 ${theme.secondaryText}`}><p className="mb-4">{prob.explanation}</p><div className="grid md:grid-cols-2 gap-4"><div><h4 className="font-bold mb-2">Possible Causes</h4><ul className="list-disc list-inside space-y-1 text-sm">{prob.possibleCauses.map((cause, i) => <li key={`cause-${i}`}>{cause}</li>)}</ul></div><div><h4 className="font-bold mb-2">Suggested Solutions</h4><ul className="list-disc list-inside space-y-1 text-sm">{prob.suggestedSolutions.map((solution, i) => <li key={`solution-${i}`}>{solution}</li>)}</ul></div></div></div>)}</div>))}</div></div><div><h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>Detailed Metrics</h3><div className="space-y-2"><div className={`grid grid-cols-4 font-bold p-2 ${theme.text}`}><p>Metric</p><p>Value</p><p>Range</p><p>Interpretation</p></div><div className="max-h-60 overflow-y-auto pr-2">{analysis.metrics.map((item, index) => (<div key={index} className={`grid grid-cols-4 p-2 rounded-lg ${theme.secondary} ${theme.secondaryText}`}><p className="font-semibold">{item.metric}</p><p>{item.value}</p><p>{item.range}</p><p className={`font-bold ${getInterpretationColor(item.interpretation)}`}>{item.interpretation}</p></div>))}</div></div></div></GlassCard>)}</GlassCard></div>);
};

const AuthPage = ({ onLogin, onSignUp }) => {
    const { theme } = useContext(ThemeContext);
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('patient');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); if (isLogin) { onLogin(userType); } else { onSignUp(userType, fullName, email); } };
    return (<div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${theme.bg}`}><div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} opacity-20 animate-gradient-x`}></div><button onClick={() => onLogin('admin')} className="absolute top-4 right-4 p-2 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-600/70 transition-colors z-20"><SlidersHorizontal size={20} /></button><GlassCard className="w-full max-w-md z-10"><div className="text-center mb-8"><BrainCircuit className={`w-16 h-16 mx-auto text-blue-400`} /><h1 className={`text-4xl font-bold mt-4 ${theme.text}`}>AuraHealth</h1><p className={`mt-2 opacity-80 ${theme.text}`}>{isLogin ? 'Your Health, Your Data, Your Control.' : 'Create your secure health account.'}</p></div><div className={`flex p-1 rounded-full mb-6 ${theme.secondary}`}><button onClick={() => setUserType('patient')} className={`w-1/2 p-2 rounded-full text-center font-semibold transition-all duration-300 ${userType === 'patient' ? `${theme.primary} ${theme.primaryText}` : `${theme.secondaryText}`}`}>Patient</button><button onClick={() => setUserType('provider')} className={`w-1/2 p-2 rounded-full text-center font-semibold transition-all duration-300 ${userType === 'provider' ? `${theme.primary} ${theme.primaryText}` : `${theme.secondaryText}`}`}>Provider</button></div><form onSubmit={handleSubmit}><div className="space-y-4">{!isLogin && <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.accent} ${theme.text}`} required />}<input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.accent} ${theme.text}`} required /><input type="password" placeholder="Password" className={`w-full p-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.accent} ${theme.text}`} required /></div><div className="mt-8"><AnimatedButton type="submit" className="w-full">{isLogin ? 'Secure Login' : 'Create Account'}</AnimatedButton></div></form><p className={`text-center text-sm mt-6 opacity-70 ${theme.text}`}>{isLogin ? "Don't have an account?" : "Already have an account?"}<a href="#" onClick={(e) => {e.preventDefault(); setIsLogin(!isLogin);}} className="font-bold hover:underline ml-1">{isLogin ? 'Sign Up' : 'Log In'}</a></p></GlassCard></div>);
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [theme, setThemeState] = useState(themes.prestige);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [viewingPatientId, setViewingPatientId] = useState(null);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [masterPatientData, setMasterPatientData] = useState(mockPatientData);

    const setTheme = (newTheme) => setThemeState(newTheme);
    
    useEffect(() => {
        const style = document.createElement('style'); style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'); @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 15s ease infinite; }`; document.head.appendChild(style);
        const jspdfScript = document.createElement('script'); jspdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; jspdfScript.async = true; document.body.appendChild(jspdfScript);
        return () => { if(document.head.contains(style)) document.head.removeChild(style); if (document.body.contains(jspdfScript)) { document.body.removeChild(jspdfScript); } };
    }, []);

    const handleLogin = (userType) => {
        let userData;
        if (userType === 'patient') userData = { ...masterPatientData, type: 'patient' };
        else if (userType === 'provider') userData = { ...mockProviderData, type: 'provider' };
        else userData = { ...mockAdminData, type: 'admin' };
        setUser(userData); 
        setCurrentPage('dashboard');
    };
    
    const handleSignUp = (userType, name, email) => {
        const newUser = { name: name, email: email, type: userType, ...(userType === 'patient' ? { ...masterPatientData, name, email } : { ...mockProviderData, name, email }) };
        setUser(newUser); setNeedsOnboarding(true);
    };
    
    const handleOnboardingComplete = (updatedUser) => {
        setUser(updatedUser); 
        if(updatedUser.type === 'patient'){
            setMasterPatientData(prev => ({...prev, ...updatedUser}));
        }
        setNeedsOnboarding(false); 
        setCurrentPage('dashboard');
    };

    const handleUpdatePatientData = (updatedPatient) => {
        // This is a master update function for any change to the patient data
        setMasterPatientData(updatedPatient);
        // If the currently logged-in user is the patient being updated, refresh their state too
        if (user && user.type === 'patient' && user.id === updatedPatient.id) {
            setUser(updatedPatient);
        }
    };
    
    const handleLogout = () => { setUser(null); setViewingPatientId(null); setNeedsOnboarding(false); };
    
    const handleNavigate = (page, data = null) => {
        if(page === 'view-patient'){ setViewingPatientId(data); } else { setViewingPatientId(null); }
        setCurrentPage(page);
    };

    const renderPage = () => {
        if (needsOnboarding) { return user.type === 'patient' ? <PatientOnboardingForm user={user} onComplete={handleOnboardingComplete} theme={theme} /> : <ProviderOnboardingForm user={user} onComplete={handleOnboardingComplete} theme={theme} />; }
        if (viewingPatientId) { const patientDataForView = { ...masterPatientData, ...mockProviderData.patients.find(p => p.id === viewingPatientId) }; return <PatientDetailViewForProvider patient={patientDataForView} providerName={user.name} onBack={() => setViewingPatientId(null)} theme={theme} onUpdatePatient={handleUpdatePatientData} />; }
        
        const currentUser = user?.type === 'patient' ? { ...masterPatientData, type: 'patient' } : user;
        if (!currentUser) return null;

        switch (currentPage) {
            case 'dashboard':
                 if (currentUser.type === 'patient') return <PatientDashboard user={currentUser} />;
                 if (currentUser.type === 'provider') return <ProviderDashboard user={currentUser} onNavigate={handleNavigate} />;
                 if (currentUser.type === 'admin') return <AdminDashboard user={currentUser} theme={theme} />;
                 return null;
            case 'profile': return currentUser.type === 'patient' ? <PatientProfilePage user={currentUser} /> : <ProviderProfilePage user={currentUser} />;
            case 'analyzer': return <AiReportAnalyzer />;
            case 'appointments': return <AppointmentPage user={currentUser} theme={theme} onUpdateAppointments={(newApts) => handleUpdatePatientData({...currentUser, appointments: newApts})} />;
            case 'my-records': return <MyRecordsPage user={currentUser} theme={theme} />;
            case 'symptom-checker': return <SymptomCheckerPage theme={theme} />;
            case 'permissions': return <PermissionsPage user={currentUser} theme={theme} onUpdatePermissions={(newPerms) => handleUpdatePatientData({...currentUser, permissions: newPerms})} />;
            case 'care-plan': return <CarePlanPage user={currentUser} theme={theme} onUpdateCarePlan={(newPlan) => handleUpdatePatientData({...currentUser, carePlan: newPlan})} />;
            default: return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />;
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div className={`min-h-screen font-sans transition-colors duration-500 ${theme.bg} ${theme.text}`}>
                {user && !needsOnboarding ? (<div className="min-h-screen w-full"><Header user={user} onLogout={handleLogout} onNavigate={handleNavigate} /><main>{renderPage()}</main></div>) 
                : user && needsOnboarding ? (renderPage()) 
                : (<AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />)}
            </div>
        </ThemeContext.Provider>
    );
}
