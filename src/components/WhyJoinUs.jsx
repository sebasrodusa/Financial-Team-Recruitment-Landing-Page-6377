import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAward, FiTarget, FiHeart, FiShield, FiBookOpen, FiDollarSign } = FiIcons;

const WhyJoinUs = () => {
  const benefits = [
    {
      icon: FiAward,
      title: "Industry Recognition",
      description: "Join a team recognized for excellence in financial services and client satisfaction."
    },
    {
      icon: FiTarget,
      title: "Clear Growth Path",
      description: "Well-defined career progression with mentorship and leadership development programs."
    },
    {
      icon: FiHeart,
      title: "Supportive Culture",
      description: "Work in an environment that values collaboration, integrity, and personal growth."
    },
    {
      icon: FiShield,
      title: "Comprehensive Benefits",
      description: "Health insurance, retirement planning, and financial protection for you and your family."
    },
    {
      icon: FiBookOpen,
      title: "Continuous Learning",
      description: "Access to industry training, certifications, and professional development resources."
    },
    {
      icon: FiDollarSign,
      title: "Competitive Compensation",
      description: "Attractive base salary plus performance-based incentives and bonuses."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Why Choose 
              <span className="text-blue-600"> Prosperity Leaders?</span>
            </h2>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={benefit.icon} className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Team collaboration"
              className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            
            {/* Floating Achievement Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-2xl"
            >
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-blue-100">Client Satisfaction</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyJoinUs;