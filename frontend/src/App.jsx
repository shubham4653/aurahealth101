import React, { useState, useEffect, useContext } from 'react';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { mockPatientData, mockProviderData, mockAdminData } from './data/mockData';
import MainLayout from './components/layout/MainLayout';
import { PatientOnboardingForm, ProviderOnboardingForm } from './components/features/Onboarding';
import { logoutPatient, logoutProvider, getPatientProfile } from './api/auth';


//Page Components

import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PatientProfilePage from './pages/PatientProfilePage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import PatientDetailView from './pages/PatientDetailView';
import RecordsPage from './pages/RecordsPage';
import AppointmentsPage from './pages/AppointmentsPage';     
import CarePlanPage from './pages/CarePlanPage';              
import PermissionsPage from './pages/PermissionsPage';        
import SymptomCheckerPage from './pages/SymptomCheckerPage';  
import AiReportAnalyzer from './components/features/AiAnalyzer';


function AppContent() {
    const { theme } = useContext(ThemeContext);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('auth');
    const [viewingPatientId, setViewingPatientId] = useState(null);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [masterPatientData, setMasterPatientData] = useState(mockPatientData);

    useEffect(() => {
        const jspdfScript = document.createElement('script');
        jspdfScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        jspdfScript.async = true;
        document.body.appendChild(jspdfScript);
        return () => {
            if (document.body.contains(jspdfScript)) {
                document.body.removeChild(jspdfScript);
            }
        };
    }, []);

    const handleLogin = async (loggedInUser, userType) => {
        let userData;
        if (userType === 'patient') {
            try {
                // After login, the token is set. Now fetch the full profile.
                const profileRes = await getPatientProfile();
                if (profileRes.success) {
                    // Combine the fetched data with the necessary user type for the frontend.
                    userData = { ...masterPatientData, ...profileRes.data, type: 'patient' };
                    setMasterPatientData(prev => ({ ...prev, ...userData }));

                } else {
                    // Fallback to mock data if fetch fails, and log an error.
                    console.error("Failed to fetch patient profile:", profileRes.message);
                    userData = { ...masterPatientData, ...loggedInUser, type: 'patient' };
                }
            } catch (error) {
                console.error("Error fetching patient profile:", error);
                userData = { ...masterPatientData, ...loggedInUser, type: 'patient' };
            }
        } else if (userType === 'provider') {
            userData = { ...mockProviderData, ...loggedInUser, type: 'provider' };
        } else { // admin
            userData = { ...mockAdminData, type: 'admin' };
        }
        setUser(userData);
        setCurrentPage('dashboard');
    };



    const handleSignUp = (userType, name, email) => {
        const newUser = {
            name: name,
            email: email,
            type: userType,
            ...(userType === 'patient' ? { ...masterPatientData, name, email } : { ...mockProviderData, name, email })
        };
        setUser(newUser);
        setNeedsOnboarding(true);
        setCurrentPage('onboarding');
    };

    const handleOnboardingComplete = (updatedUser) => {
        setUser(updatedUser);
        if (updatedUser.type === 'patient') {
            setMasterPatientData(prev => ({ ...prev, ...updatedUser }));
        }
        setNeedsOnboarding(false);
        setCurrentPage('dashboard');
    };

    const handleUpdatePatientData = (updatedPatient) => {
        setMasterPatientData(updatedPatient);
        if (user && user.type === 'patient' && user.id === updatedPatient.id) {
            setUser(updatedPatient);
        }
    };

    const refetchPatientData = async () => {
        if (user?.type === 'patient') {
            try {
                const profileRes = await getPatientProfile();
                if (profileRes.success) {
                    const updatedUserData = { ...user, ...profileRes.data };
                    setUser(updatedUserData);
                    if (masterPatientData.id === updatedUserData.id) {
                        setMasterPatientData(prev => ({ ...prev, ...updatedUserData }));
                    }
                }
            } catch (error) {
                console.error("Failed to refetch patient data:", error);
            }
        }
    };

    const refetchProviderData = async () => {
        if (user?.type === 'provider') {
            try {
                const profileRes = await getProviderProfile();
                if (profileRes.success) {
                    const updatedUserData = { ...user, ...profileRes.data };
                    setUser(updatedUserData);
                    if (masterPatientData.id === updatedUserData.id) {
                        setMasterProviderData(prev => ({ ...prev, ...updatedUserData }));
                    }
                }
            } catch (error) {
                console.error("Failed to refetch provider data:", error);
            }
        }
    };




    const handleLogout = async () => {
        try {
            if (user?.type === 'patient') {
                await logoutPatient();
            } else if (user?.type === 'provider') {
                await logoutProvider();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
        setUser(null);
        setViewingPatientId(null);
        setNeedsOnboarding(false);
        setCurrentPage('auth');
    };


    const handleNavigate = (page, data = null) => {
        if (page === 'view-patient') {
            setViewingPatientId(data);
        } else {
            setViewingPatientId(null);
        }
        setCurrentPage(page);
    };

    const renderPage = () => {
        if (!user) {
            return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />;
        }

        if (needsOnboarding) {
            return user.type === 'patient'
                ? <PatientOnboardingForm user={user} onComplete={handleOnboardingComplete} theme={theme} />
                : <ProviderOnboardingForm user={user} onComplete={handleOnboardingComplete} theme={theme} />;
        }

        if (viewingPatientId) {
            const patientDataForView = { ...masterPatientData, ...mockProviderData.patients.find(p => p.id === viewingPatientId) };
            return <PatientDetailView patient={patientDataForView} providerName={user.name} onBack={() => setViewingPatientId(null)} theme={theme} onUpdatePatient={handleUpdatePatientData} />;
        }

        const currentUser = user;


        let pageComponent;
        switch (currentPage) {
            case 'dashboard':
                if (currentUser.type === 'patient') pageComponent = <PatientDashboard user={currentUser} />;
                else if (currentUser.type === 'provider') pageComponent = <ProviderDashboard user={currentUser} onNavigate={handleNavigate} />;
                else if (currentUser.type === 'admin') pageComponent = <AdminDashboard user={currentUser} />;
                break;
            case 'profile':
                pageComponent = currentUser.type === 'patient' ? <PatientProfilePage user={currentUser} onUpdatePatientData={refetchPatientData} /> : <ProviderProfilePage user={currentUser} onUpdateProviderData={refetchPatientData} />;
                break;
            // --- ADD THE CASES FOR YOUR NEW PAGES HERE ---
            case 'appointments':
                pageComponent = <AppointmentsPage user={currentUser} onUpdateAppointments={(newApts) => handleUpdatePatientData({ ...currentUser, appointments: newApts })} />;
                break;
            case 'care-plan':
                pageComponent = <CarePlanPage user={currentUser} onUpdateCarePlan={(newPlan) => handleUpdatePatientData({ ...currentUser, carePlan: newPlan })} />;
                break;
            case 'my-records':
                pageComponent = <RecordsPage user={currentUser} />;
                break;
            case 'permissions':
                pageComponent = <PermissionsPage user={currentUser} onUpdatePermissions={(newPerms) => handleUpdatePatientData({ ...currentUser, permissions: newPerms })} />;
                break;
            case 'symptom-checker':
                pageComponent = <SymptomCheckerPage />;
                break;
            case 'analyzer':
                pageComponent = <AiReportAnalyzer />;
                break;

            default:
                pageComponent = <PatientDashboard user={currentUser} />; // Fallback to dashboard
        }

        return (
            <MainLayout user={currentUser} onLogout={handleLogout} onNavigate={handleNavigate}>
                {pageComponent}
            </MainLayout>
        );
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${theme.bg} ${theme.text}`}>
            {renderPage()}
        </div>
    );
}


export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}
