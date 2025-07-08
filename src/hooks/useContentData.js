import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export const useContentData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentSections, setContentSections] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all content sections
        const { data: sections, error: sectionsError } = await supabase
          .from('content_sections_xh9s4a')
          .select('*');
        
        if (sectionsError) throw sectionsError;
        
        // Fetch all section items
        const { data: items, error: itemsError } = await supabase
          .from('section_items_xh9s4a')
          .select('*')
          .order('order_index');
        
        if (itemsError) throw itemsError;
        
        // Organize data by section
        const organizedContent = {};
        
        sections.forEach(section => {
          const sectionItems = items.filter(item => item.section_id === section.id);
          organizedContent[section.section_name] = {
            ...section,
            items: sectionItems
          };
        });
        
        setContentSections(organizedContent);
      } catch (error) {
        console.error('Error fetching content:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Subscribe to changes
    const sectionsSubscription = supabase
      .channel('content_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_sections_xh9s4a' }, 
        () => fetchData()
      )
      .subscribe();
    
    const itemsSubscription = supabase
      .channel('items_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'section_items_xh9s4a' }, 
        () => fetchData()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(sectionsSubscription);
      supabase.removeChannel(itemsSubscription);
    };
  }, []);
  
  return { contentSections, loading, error };
};