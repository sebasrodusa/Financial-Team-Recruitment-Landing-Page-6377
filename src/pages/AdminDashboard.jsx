import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import { clearMockSession } from '../lib/authUtils';
import { useAuth } from '../lib/authComponents';
import SafeIcon from '../common/SafeIcon';

const { FiEdit2, FiSave, FiX, FiLogOut, FiHome, FiPlusCircle, FiTrash2 } = FiIcons;

const AdminDashboard = () => {
  const { session, loading } = useAuth();
  const [sections, setSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [sectionItems, setSectionItems] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);

  useEffect(() => {
    if (session) {
      fetchSections();
    }
  }, [session]);

  const fetchSections = async () => {
    try {
      // For demo, create dummy sections if needed
      const mockSections = [
        {
          id: '1',
          section_name: 'hero',
          title: 'We Are Growing the Team',
          subtitle: 'Full-time, part-time, twin career or entrepreneurship opportunities in the financial industry'
        },
        {
          id: '2',
          section_name: 'opportunities',
          title: 'Choose Your Path to Success',
          subtitle: 'We offer diverse opportunities to match your lifestyle and career goals in the financial industry'
        },
        {
          id: '3',
          section_name: 'benefits',
          title: 'Why Choose Prosperity Leaders?',
          subtitle: 'Join a team that values growth, integrity, and success'
        },
        {
          id: '4',
          section_name: 'leadership',
          title: 'Meet Your Leader',
          subtitle: 'Led by industry expert Jenny Rodriguez-Minchala, our team is committed to your success'
        }
      ];

      // Try to get real data first
      const { data, error } = await supabase
        .from('content_sections_xh9s4a')
        .select('*')
        .order('section_name');

      // Use mock data if error or no data
      if (error || !data || data.length === 0) {
        setSections(mockSections);
        if (mockSections.length > 0) {
          setActiveSectionId(mockSections[0].id);
          fetchSectionItems(mockSections[0].id);
        }
      } else {
        setSections(data);
        if (data.length > 0) {
          setActiveSectionId(data[0].id);
          fetchSectionItems(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      // Fallback to mock data
      const mockSections = [
        {
          id: '1',
          section_name: 'hero',
          title: 'We Are Growing the Team',
          subtitle: 'Full-time, part-time, twin career or entrepreneurship opportunities in the financial industry'
        },
        {
          id: '2',
          section_name: 'opportunities',
          title: 'Choose Your Path to Success',
          subtitle: 'We offer diverse opportunities to match your lifestyle and career goals in the financial industry'
        },
        {
          id: '3',
          section_name: 'benefits',
          title: 'Why Choose Prosperity Leaders?',
          subtitle: 'Join a team that values growth, integrity, and success'
        },
        {
          id: '4',
          section_name: 'leadership',
          title: 'Meet Your Leader',
          subtitle: 'Led by industry expert Jenny Rodriguez-Minchala, our team is committed to your success'
        }
      ];
      setSections(mockSections);
      if (mockSections.length > 0) {
        setActiveSectionId(mockSections[0].id);
        fetchSectionItems(mockSections[0].id);
      }
    }
  };

  const fetchSectionItems = async (sectionId) => {
    try {
      // Mock items for demonstration
      const mockItems = {
        '1': [], // Hero doesn't have items
        '2': [ // Opportunities
          {
            id: '21',
            section_id: '2',
            title: 'Full-Time Positions',
            description: 'Dedicated career paths with comprehensive benefits and growth opportunities in the financial sector.',
            icon_name: 'Clock',
            order_index: 1
          },
          {
            id: '22',
            section_id: '2',
            title: 'Part-Time Flexibility',
            description: 'Balance your life while building a rewarding career in financial services with flexible scheduling.',
            icon_name: 'Calendar',
            order_index: 2
          },
          {
            id: '23',
            section_id: '2',
            title: 'Twin Career Path',
            description: 'Perfect for couples or partners looking to build complementary careers in the financial industry.',
            icon_name: 'Users',
            order_index: 3
          },
          {
            id: '24',
            section_id: '2',
            title: 'Entrepreneurship',
            description: 'Launch your own financial services business with our proven systems and ongoing support.',
            icon_name: 'TrendingUp',
            order_index: 4
          }
        ],
        '3': [ // Benefits
          {
            id: '31',
            section_id: '3',
            title: 'Industry Recognition',
            description: 'Join a team recognized for excellence in financial services and client satisfaction.',
            icon_name: 'Award',
            order_index: 1
          },
          {
            id: '32',
            section_id: '3',
            title: 'Clear Growth Path',
            description: 'Well-defined career progression with mentorship and leadership development programs.',
            icon_name: 'Target',
            order_index: 2
          },
          {
            id: '33',
            section_id: '3',
            title: 'Supportive Culture',
            description: 'Work in an environment that values collaboration, integrity, and personal growth.',
            icon_name: 'Heart',
            order_index: 3
          },
          {
            id: '34',
            section_id: '3',
            title: 'Comprehensive Benefits',
            description: 'Health insurance, retirement planning, and financial protection for you and your family.',
            icon_name: 'Shield',
            order_index: 4
          },
          {
            id: '35',
            section_id: '3',
            title: 'Continuous Learning',
            description: 'Access to industry training, certifications, and professional development resources.',
            icon_name: 'BookOpen',
            order_index: 5
          },
          {
            id: '36',
            section_id: '3',
            title: 'Competitive Compensation',
            description: 'Attractive base salary plus performance-based incentives and bonuses.',
            icon_name: 'DollarSign',
            order_index: 6
          }
        ],
        '4': [] // Leadership doesn't have items
      };

      // Try to get real data first
      const { data, error } = await supabase
        .from('section_items_xh9s4a')
        .select('*')
        .eq('section_id', sectionId)
        .order('order_index');

      // Use mock data if error or no data
      if (error || !data || data.length === 0) {
        setSectionItems(mockItems[sectionId] || []);
      } else {
        setSectionItems(data);
      }
    } catch (error) {
      console.error('Error fetching section items:', error);
      // Fallback to mock data
      const mockItems = {
        '1': [], // Hero doesn't have items
        '2': [ // Opportunities
          {
            id: '21',
            section_id: '2',
            title: 'Full-Time Positions',
            description: 'Dedicated career paths with comprehensive benefits and growth opportunities in the financial sector.',
            icon_name: 'Clock',
            order_index: 1
          },
          {
            id: '22',
            section_id: '2',
            title: 'Part-Time Flexibility',
            description: 'Balance your life while building a rewarding career in financial services with flexible scheduling.',
            icon_name: 'Calendar',
            order_index: 2
          },
          {
            id: '23',
            section_id: '2',
            title: 'Twin Career Path',
            description: 'Perfect for couples or partners looking to build complementary careers in the financial industry.',
            icon_name: 'Users',
            order_index: 3
          },
          {
            id: '24',
            section_id: '2',
            title: 'Entrepreneurship',
            description: 'Launch your own financial services business with our proven systems and ongoing support.',
            icon_name: 'TrendingUp',
            order_index: 4
          }
        ],
        '3': [ // Benefits
          {
            id: '31',
            section_id: '3',
            title: 'Industry Recognition',
            description: 'Join a team recognized for excellence in financial services and client satisfaction.',
            icon_name: 'Award',
            order_index: 1
          },
          {
            id: '32',
            section_id: '3',
            title: 'Clear Growth Path',
            description: 'Well-defined career progression with mentorship and leadership development programs.',
            icon_name: 'Target',
            order_index: 2
          },
          {
            id: '33',
            section_id: '3',
            title: 'Supportive Culture',
            description: 'Work in an environment that values collaboration, integrity, and personal growth.',
            icon_name: 'Heart',
            order_index: 3
          }
        ],
        '4': [] // Leadership doesn't have items
      };
      setSectionItems(mockItems[sectionId] || []);
    }
  };

  const handleSectionClick = (sectionId) => {
    setActiveSectionId(sectionId);
    fetchSectionItems(sectionId);
    setEditingSection(null);
    setEditingItem(null);
    setNewItem(null);
  };

  const handleEditSection = (section) => {
    setEditingSection({ ...section });
  };

  const handleSaveSectionEdit = async () => {
    try {
      // For mock session, just update local state
      if (localStorage.getItem('mockAdminSession')) {
        // Update local state
        setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
        setEditingSection(null);
        return;
      }

      // For real Supabase session
      const { error } = await supabase
        .from('content_sections_xh9s4a')
        .update({
          title: editingSection.title,
          subtitle: editingSection.subtitle,
          updated_at: new Date()
        })
        .eq('id', editingSection.id);

      if (error) throw error;

      // Update local state
      setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating section:', error);
      // For demo, still update the UI
      setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
      setEditingSection(null);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
    setNewItem(null);
  };

  const handleSaveItemEdit = async () => {
    try {
      // For mock session, just update local state
      if (localStorage.getItem('mockAdminSession')) {
        setSectionItems(sectionItems.map(i => i.id === editingItem.id ? editingItem : i));
        setEditingItem(null);
        return;
      }

      // For real Supabase session
      const { error } = await supabase
        .from('section_items_xh9s4a')
        .update({
          title: editingItem.title,
          description: editingItem.description,
          icon_name: editingItem.icon_name,
          image_url: editingItem.image_url,
          updated_at: new Date()
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      // Update local state
      setSectionItems(sectionItems.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      // For demo, still update the UI
      setSectionItems(sectionItems.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
    }
  };

  const handleAddNewItem = () => {
    setNewItem({
      id: `new-${Date.now()}`, // Temporary ID for mock mode
      title: '',
      description: '',
      icon_name: '',
      image_url: '',
      order_index: sectionItems.length + 1,
      section_id: activeSectionId
    });
    setEditingItem(null);
  };

  const handleSaveNewItem = async () => {
    try {
      // For mock session, just update local state
      if (localStorage.getItem('mockAdminSession')) {
        setSectionItems([...sectionItems, newItem]);
        setNewItem(null);
        return;
      }

      // For real Supabase session
      const { data, error } = await supabase
        .from('section_items_xh9s4a')
        .insert(newItem)
        .select();

      if (error) throw error;

      // Update local state
      setSectionItems([...sectionItems, data[0]]);
      setNewItem(null);
    } catch (error) {
      console.error('Error adding new item:', error);
      // For demo, still update the UI
      setSectionItems([...sectionItems, newItem]);
      setNewItem(null);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // For mock session, just update local state
      if (localStorage.getItem('mockAdminSession')) {
        setSectionItems(sectionItems.filter(i => i.id !== itemId));
        return;
      }

      // For real Supabase session
      const { error } = await supabase
        .from('section_items_xh9s4a')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      setSectionItems(sectionItems.filter(i => i.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      // For demo, still update the UI
      setSectionItems(sectionItems.filter(i => i.id !== itemId));
    }
  };

  const handleLogout = async () => {
    // Clear mock session if exists
    clearMockSession();
    
    // Also sign out from Supabase
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" />;
  }

  const activeSection = sections.find(s => s.id === activeSectionId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Prosperity Leaders Admin</h1>
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded">
              <SafeIcon icon={FiHome} className="w-5 h-5" />
              <span>View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="md:w-1/4 bg-gray-50 p-4 border-r border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Content Sections</h2>
              <ul className="space-y-2">
                {sections.map(section => (
                  <li key={section.id}>
                    <button
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full text-left px-4 py-2 rounded ${
                        activeSectionId === section.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {section.section_name.charAt(0).toUpperCase() + section.section_name.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4 p-6">
              {activeSection && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      {editingSection ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingSection.title}
                            onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xl font-bold"
                          />
                          <textarea
                            value={editingSection.subtitle || ''}
                            onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            rows="2"
                          ></textarea>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveSectionEdit}
                              className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            >
                              <SafeIcon icon={FiSave} className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingSection(null)}
                              className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                            >
                              <SafeIcon icon={FiX} className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">{activeSection.title}</h2>
                          <p className="text-gray-600">{activeSection.subtitle}</p>
                        </div>
                      )}
                    </div>
                    {!editingSection && (
                      <button
                        onClick={() => handleEditSection(activeSection)}
                        className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                        <span>Edit Section</span>
                      </button>
                    )}
                  </div>

                  {/* Section Items */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Content Items</h3>
                      <button
                        onClick={handleAddNewItem}
                        className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                      >
                        <SafeIcon icon={FiPlusCircle} className="w-4 h-4" />
                        <span>Add New Item</span>
                      </button>
                    </div>

                    {/* New Item Form */}
                    {newItem && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200"
                      >
                        <h4 className="text-lg font-medium mb-3">Add New Item</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={newItem.title}
                              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Icon Name (e.g. Award, Clock)</label>
                            <input
                              type="text"
                              value={newItem.icon_name}
                              onChange={(e) => setNewItem({ ...newItem, icon_name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={newItem.description || ''}
                              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows="3"
                            ></textarea>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                            <input
                              type="text"
                              value={newItem.image_url || ''}
                              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveNewItem}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Save New Item
                          </button>
                          <button
                            onClick={() => setNewItem(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Items List */}
                    <div className="space-y-4">
                      {sectionItems.length === 0 ? (
                        <p className="text-gray-500 italic">No items found for this section.</p>
                      ) : (
                        sectionItems.map(item => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow"
                          >
                            {editingItem && editingItem.id === item.id ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-3"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                      type="text"
                                      value={editingItem.title || ''}
                                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Icon Name</label>
                                    <input
                                      type="text"
                                      value={editingItem.icon_name || ''}
                                      onChange={(e) => setEditingItem({ ...editingItem, icon_name: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                      value={editingItem.description || ''}
                                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                      rows="3"
                                    ></textarea>
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Image URL</label>
                                    <input
                                      type="text"
                                      value={editingItem.image_url || ''}
                                      onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={handleSaveItemEdit}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                                  >
                                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingItem(null)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                                  >
                                    <SafeIcon icon={FiX} className="w-4 h-4" />
                                    <span>Cancel</span>
                                  </button>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    {item.icon_name && (
                                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                        <SafeIcon name={item.icon_name} className="w-4 h-4" />
                                      </div>
                                    )}
                                    <h4 className="font-medium">{item.title}</h4>
                                  </div>
                                  <p className="text-gray-600 text-sm">{item.description}</p>
                                  {item.image_url && (
                                    <div className="mt-2">
                                      <span className="text-xs text-gray-500">Image: </span>
                                      <span className="text-xs text-blue-500">{item.image_url}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="text-blue-600 hover:text-blue-800 p-1"
                                    title="Edit"
                                  >
                                    <SafeIcon icon={FiEdit2} className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Delete"
                                  >
                                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;