import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiUser, FiStar, FiTrendingUp, FiAward } = FiIcons;

const AboutLeadership = () => {
  const [content, setContent] = useState({
    title: 'Meet Your Leader',
    subtitle: 'Led by industry expert Jenny Rodriguez-Minchala, our team is committed to your success',
    featured_image: 'https://images.unsplash.com/photo-1594736797933-d0d62a0a2fe2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content_sections_xh9s4a')
          .select('*')
          .eq('section_name', 'leadership')
          .single();

        if (error) {
          console.error('Error fetching leadership content:', error);
          return;
        }

        if (data) {
          setContent({
            title: data.title || content.title,
            subtitle: data.subtitle || content.subtitle,
            featured_image: data.featured_image || content.featured_image
          });
        }
      } catch (error) {
        console.error('Error fetching leadership content:', error);
      }
    };

    fetchContent();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('leadership_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_sections_xh9s4a',
          filter: 'section_name=eq.leadership'
        },
        (payload) => {
          console.log('Leadership content updated:', payload);
          if (payload.new) {
            setContent(prev => ({
              title: payload.new.title || prev.title,
              subtitle: payload.new.subtitle || prev.subtitle,
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
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Jenny's Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={content.featured_image}
                alt="Jenny Rodriguez-Minchala"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-2xl"></div>
            </div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-2xl"
            >
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiAward} className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-lg font-bold text-gray-900">Top Performer</div>
                  <div className="text-sm text-gray-600">2024 Recognition</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Jenny Rodriguez-Minchala
              </h3>
              <p className="text-lg text-blue-600 font-semibold mb-6">
                Senior Financial Advisor & Team Leader
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                With over 15 years of experience in the financial industry, Jenny has built a reputation for excellence in client service and team development. Her leadership approach focuses on empowering individuals to achieve their personal and professional goals while maintaining the highest standards of integrity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <SafeIcon icon={FiUser} className="w-8 h-8 text-blue-600 mb-4" />
                <div className="text-2xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Clients Served</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <SafeIcon icon={FiStar} className="w-8 h-8 text-blue-600 mb-4" />
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-blue-600 mb-4" />
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <SafeIcon icon={FiAward} className="w-8 h-8 text-blue-600 mb-4" />
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">Industry Awards</div>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-xl">
              <blockquote className="text-lg italic">
                "Success in the financial industry isn't just about numbers—it's about building relationships, creating trust, and helping people achieve their dreams. I'm passionate about developing leaders who share these values."
              </blockquote>
              <div className="mt-4 font-semibold">- Jenny Rodriguez-Minchala</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutLeadership;