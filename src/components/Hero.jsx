import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiTrendingUp, FiUsers, FiStar } = FiIcons;

const Hero = () => {
  const [content, setContent] = useState({
    title: 'We Are Growing the Team',
    subtitle: 'Full-time, part-time, twin career or entrepreneurship opportunities in the financial industry',
    background_image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80',
    featured_image: ''
  });

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content_sections_xh9s4a')
          .select('*')
          .eq('section_name', 'hero')
          .single();

        if (error) {
          console.error('Error fetching hero content:', error);
          return;
        }

        if (data) {
          setContent({
            title: data.title || content.title,
            subtitle: data.subtitle || content.subtitle,
            background_image: data.background_image || content.background_image,
            featured_image: data.featured_image || content.featured_image
          });
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
      }
    };

    fetchHeroContent();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('hero_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_sections_xh9s4a',
          filter: 'section_name=eq.hero'
        },
        (payload) => {
          console.log('Hero content updated:', payload);
          if (payload.new) {
            setContent(prev => ({
              title: payload.new.title || prev.title,
              subtitle: payload.new.subtitle || prev.subtitle,
              background_image: payload.new.background_image || prev.background_image,
              featured_image: payload.new.featured_image || prev.featured_image
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 text-blue-200"
              >
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Financial Industry Leaders</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-bold leading-tight"
              >
                {content.title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-blue-300">{content.title.split(' ').slice(-1)}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-blue-100 leading-relaxed"
              >
                {content.subtitle}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 text-sm"
            >
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <SafeIcon icon={FiUsers} className="w-4 h-4" />
                <span>Team Growth</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <SafeIcon icon={FiStar} className="w-4 h-4" />
                <span>Financial Excellence</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Join Our Team
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={content.background_image}
                alt="Professional team meeting"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white text-blue-900 p-6 rounded-xl shadow-2xl"
            >
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-gray-600">Success Stories</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;