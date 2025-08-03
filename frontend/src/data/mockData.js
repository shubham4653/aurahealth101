// This file contains all the mock data for the application.
// In a real application, this data would come from a backend API.

export const mockPatientData = {
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
export const mockProviderData = {
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
export const mockAdminData = {
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