import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const OpportunityTypes = () => {
  const [content, setContent] = useState({
    title: 'Choose Your Path to Success',
    subtitle: 'We offer diverse opportunities to match your lifestyle and career goals in the financial industry',
    items: []
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch section content
        const { data: sectionData, error: sectionError } = await supabase
          .from('content_sections_xh9s4a')
          .select('*')
          .eq('section_name', 'opportunities')
          .single();

        if (sectionError) throw sectionError;

        // Fetch section items
        const { data: itemsData, error: itemsError } = await supabase
          .from('section_items_xh9s4a')
          .select('*')
          .eq('section_id', sectionData.id)
          .order('order_index');

        if (itemsError) throw itemsError;

        // Process items to match the expected format
        const processedItems = itemsData.map(item => ({
          icon: FiIcons[`Fi${item.icon_name}`],
          title: item.title,
          description: item.description,
          features: [] // We could add features as a JSON field in the database if needed
        }));

        setContent({
          title: sectionData.title,
          subtitle: sectionData.subtitle,
          items: processedItems
        });
      } catch (error) {
        console.error('Error fetching opportunity types:', error);
      }
    };

    fetchContent();

    // Subscribe to changes
    const sectionSubscription = supabase
      .channel('opportunities_section_changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'content_sections_xh9s4a', filter: 'section_name=eq.opportunities' },
        () => fetchContent()
      )
      .subscribe();

    const itemsSubscription = supabase
      .channel('opportunities_items_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'section_items_xh9s4a' },
        () => fetchContent()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sectionSubscription);
      supabase.removeChannel(itemsSubscription);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  // Fallback data if no items are loaded
  const defaultItems = [
    {
      icon: FiIcons.FiClock,
      title: "Full-Time Positions",
      description: "Dedicated career paths with comprehensive benefits and growth opportunities in the financial sector.",
      features: ["Competitive Salary", "Health Benefits", "Career Development", "Leadership Training"]
    },
    {
      icon: FiIcons.FiCalendar,
      title: "Part-Time Flexibility",
      description: "Balance your life while building a rewarding career in financial services with flexible scheduling.",
      features: ["Flexible Hours", "Work-Life Balance", "Skill Development", "Performance Bonuses"]
    },
    {
      icon: FiIcons.FiUsers,
      title: "Twin Career Path",
      description: "Perfect for couples or partners looking to build complementary careers in the financial industry.",
      features: ["Dual Opportunities", "Shared Growth", "Team Building", "Joint Success"]
    },
    {
      icon: FiIcons.FiTrendingUp,
      title: "Entrepreneurship",
      description: "Launch your own financial services business with our proven systems and ongoing support.",
      features: ["Business Ownership", "Proven Systems", "Ongoing Support", "Unlimited Potential"]
    }
  ];

  const opportunities = content.items.length > 0 ? content.items : defaultItems;

  return (
    <section className="py-20 bg-gray-50">
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <SafeIcon icon={opportunity.icon} className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {opportunity.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {opportunity.description}
              </p>
              
              <ul className="space-y-3">
                {opportunity.features && opportunity.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OpportunityTypes;