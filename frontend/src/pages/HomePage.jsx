import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Text, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import HomeNavbar from '../components/layout/HomeNavbar';
import { 
    Heart, 
    Shield, 
    Brain, 
    Lock, 
    Smartphone, 
    Database, 
    Zap, 
    Users, 
    FileText, 
    MessageSquare,
    Calendar,
    BarChart3,
    ArrowRight,
    Play,
    Star,
    CheckCircle,
    Globe,
    Cpu,
    Cloud,
    GitBranch
} from 'lucide-react';

// 3D Animated Sphere Component - Optimized for mobile
const AnimatedSphere = ({ isMobile = false }) => {
    const meshRef = useRef();
    
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * (isMobile ? 0.1 : 0.2);
            meshRef.current.rotation.y += delta * (isMobile ? 0.15 : 0.3);
        }
    });

    return (
        <Float speed={isMobile ? 1 : 2} rotationIntensity={isMobile ? 0.5 : 1} floatIntensity={isMobile ? 1 : 2}>
            <Sphere ref={meshRef} args={[1, isMobile ? 50 : 100, isMobile ? 100 : 200]} scale={isMobile ? 2 : 2.4}>
                <MeshDistortMaterial
                    color="#3B82F6"
                    attach="material"
                    distort={isMobile ? 0.2 : 0.3}
                    speed={isMobile ? 1 : 1.5}
                    roughness={0}
                />
            </Sphere>
        </Float>
    );
};

// Floating Icons Component
const FloatingIcon = ({ position, icon: Icon, color, delay = 0 }) => {
    const meshRef = useRef();
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.3;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={meshRef} position={position}>
                <mesh>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            </group>
        </Float>
    );
};

// Hero Section Component
const HeroSection = ({ onTryNow }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            {/* 3D Background - Optimized for mobile */}
            <div className="absolute inset-0">
                <Canvas 
                    camera={{ position: [0, 0, isMobile ? 7 : 5], fov: isMobile ? 60 : 75 }}
                    performance={{ min: 0.5 }}
                    dpr={isMobile ? [1, 2] : [1, 2]}
                >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <AnimatedSphere isMobile={isMobile} />
                    {!isMobile && (
                        <>
                            <FloatingIcon position={[-3, 2, 0]} icon={Heart} color="#EF4444" delay={0} />
                            <FloatingIcon position={[3, -2, 0]} icon={Shield} color="#10B981" delay={1} />
                            <FloatingIcon position={[-2, -3, 0]} icon={Brain} color="#8B5CF6" delay={2} />
                            <FloatingIcon position={[2, 3, 0]} icon={Lock} color="#F59E0B" delay={1.5} />
                        </>
                    )}
                    <Environment preset="night" />
                </Canvas>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Aura Health
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto px-4">
                        Revolutionizing healthcare with blockchain-secured medical records, 
                        AI-powered diagnostics, and seamless patient-provider communication.
                    </p>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onTryNow}
                            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Try Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full text-lg hover:bg-white/10 transition-all duration-300"
                        >
                            <Play className="w-5 h-5" />
                            Watch Demo
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-3 bg-white/60 rounded-full mt-2"
                    />
                </div>
            </motion.div>
        </section>
    );
};

// Features Section Component
const FeaturesSection = () => {
    const features = [
        {
            icon: Shield,
            title: "Blockchain Security",
            description: "Your medical records are secured with blockchain technology, ensuring tamper-proof data integrity.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Brain,
            title: "AI-Powered Analysis",
            description: "Advanced AI algorithms analyze your health data to provide personalized insights and recommendations.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Users,
            title: "Seamless Communication",
            description: "Connect with healthcare providers through secure messaging and video consultations.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: FileText,
            title: "Digital Records",
            description: "Access all your medical records, test results, and prescriptions in one secure digital platform.",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: Smartphone,
            title: "Mobile Access",
            description: "Manage your health on-the-go with our responsive mobile-friendly interface.",
            color: "from-indigo-500 to-purple-500"
        },
        {
            icon: BarChart3,
            title: "Health Analytics",
            description: "Track your health trends and get detailed analytics to make informed decisions.",
            color: "from-teal-500 to-green-500"
        }
    ];

    return (
        <section id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Powerful Features for
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modern Healthcare</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Experience the future of healthcare with our comprehensive suite of features designed to enhance patient care and provider efficiency.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="group relative p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Technology Stack Section
const TechStackSection = () => {
    const technologies = [
        { name: "React", category: "Frontend", icon: "⚛️", color: "bg-blue-500" },
        { name: "Node.js", category: "Backend", icon: "🟢", color: "bg-green-500" },
        { name: "MongoDB", category: "Database", icon: "🍃", color: "bg-emerald-500" },
        { name: "Three.js", category: "3D Graphics", icon: "🎮", color: "bg-purple-500" },
        { name: "Blockchain", category: "Security", icon: "⛓️", color: "bg-yellow-500" },
        { name: "AI/ML", category: "Intelligence", icon: "🤖", color: "bg-pink-500" },
        { name: "Web3", category: "Decentralized", icon: "🌐", color: "bg-indigo-500" },
        { name: "Cloudinary", category: "Storage", icon: "☁️", color: "bg-cyan-500" }
    ];

    return (
        <section id="technology" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Built with
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Modern Technology</span>
                    </h2>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Leveraging cutting-edge technologies to deliver a secure, scalable, and user-friendly healthcare platform.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="group"
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
                                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{tech.icon}</div>
                                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">{tech.name}</h3>
                                <p className="text-blue-200 text-xs sm:text-sm">{tech.category}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Stats Section
const StatsSection = () => {
    const stats = [
        { number: "10K+", label: "Active Users", icon: Users },
        { number: "99.9%", label: "Uptime", icon: Zap },
        { number: "256-bit", label: "Encryption", icon: Lock },
        { number: "24/7", label: "Support", icon: Globe }
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                            <div className="text-blue-100 text-sm sm:text-lg">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// CTA Section
const CTASection = ({ onTryNow }) => {
    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Healthcare Experience?
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-4">
                        Join thousands of patients and providers who trust Aura Health for secure, efficient, and personalized healthcare management.
                    </p>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onTryNow}
                        className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-lg sm:text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl"
                    >
                        <span className="flex items-center justify-center gap-3">
                            Get Started Now
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

// Main HomePage Component
const HomePage = ({ onTryNow }) => {
    return (
        <div className="min-h-screen">
            <HomeNavbar onTryNow={onTryNow} />
            <HeroSection onTryNow={onTryNow} />
            <FeaturesSection />
            <TechStackSection />
            <StatsSection />
            <CTASection onTryNow={onTryNow} />
        </div>
    );
};

export default HomePage;
