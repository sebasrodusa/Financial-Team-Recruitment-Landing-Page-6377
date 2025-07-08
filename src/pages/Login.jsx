import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = ({ userId, token, newUser }) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Section - Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 text-white"
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Welcome to<br />
            <span className="text-blue-400">Prosperity Leaders</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Join our team of financial professionals and start your journey towards success.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Why Join Us?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Professional Development</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Competitive Compensation</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Supportive Team Environment</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right Section - Login Component */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <QuestLogin
              onSubmit={handleLogin}
              email={true}
              google={false}
              accent="#2563eb"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;