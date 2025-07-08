import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import { clearMockSession } from '../lib/authUtils';
import { useAuth } from '../lib/authComponents';
import SafeIcon from '../common/SafeIcon';

const { FiEdit2, FiSave, FiX, FiLogOut, FiHome, FiPlusCircle, FiTrash2, FiSettings, FiUsers, FiFileText, FiImage, FiUpload } = FiIcons;

const AdminDashboard = () => {
  const { session, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('content');
  const [sections, setSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [sectionItems, setSectionItems] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [leads, setLeads] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [editingSettings, setEditingSettings] = useState(false);

  useEffect(() => {
    if (session) {
      fetchSections();
      fetchLeads();
      fetchSiteSettings();
    }
  }, [session]);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections_xh9s4a')
        .select('*')
        .order('section_name');

      if (error) throw error;

      if (data && data.length > 0) {
        setSections(data);
        setActiveSectionId(data[0].id);
        fetchSectionItems(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchSectionItems = async (sectionId) => {
    try {
      const { data, error } = await supabase
        .from('section_items_xh9s4a')
        .select('*')
        .eq('section_id', sectionId)
        .order('order_index');

      if (error) throw error;
      setSectionItems(data || []);
    } catch (error) {
      console.error('Error fetching section items:', error);
      setSectionItems([]);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_management_xk9m8b')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings_xk9m8b')
        .select('*');

      if (error) throw error;
      
      const settings = {};
      data.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value;
      });
      setSiteSettings(settings);
    } catch (error) {
      console.error('Error fetching site settings:', error);
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
      const { error } = await supabase
        .from('content_sections_xh9s4a')
        .update({
          title: editingSection.title,
          subtitle: editingSection.subtitle,
          background_image: editingSection.background_image,
          featured_image: editingSection.featured_image,
          updated_at: new Date()
        })
        .eq('id', editingSection.id);

      if (error) throw error;

      setSections(sections.map(s => s.id === editingSection.id ? editingSection : s));
      setEditingSection(null);
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
    setNewItem(null);
  };

  const handleSaveItemEdit = async () => {
    try {
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

      setSectionItems(sectionItems.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleAddNewItem = () => {
    setNewItem({
      id: `new-${Date.now()}`,
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
      const { data, error } = await supabase
        .from('section_items_xh9s4a')
        .insert({
          section_id: activeSectionId,
          title: newItem.title,
          description: newItem.description,
          icon_name: newItem.icon_name,
          image_url: newItem.image_url,
          order_index: newItem.order_index
        })
        .select();

      if (error) throw error;

      setSectionItems([...sectionItems, data[0]]);
      setNewItem(null);
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('section_items_xh9s4a')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setSectionItems(sectionItems.filter(i => i.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      const { error } = await supabase
        .from('leads_management_xk9m8b')
        .update({ status: newStatus, updated_at: new Date() })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase
        .from('leads_management_xk9m8b')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleUpdateSiteSettings = async () => {
    try {
      for (const [key, value] of Object.entries(siteSettings)) {
        await supabase
          .from('site_settings_xk9m8b')
          .upsert({
            setting_key: key,
            setting_value: value,
            updated_at: new Date()
          });
      }
      setEditingSettings(false);
    } catch (error) {
      console.error('Error updating site settings:', error);
    }
  };

  const handleLogout = async () => {
    clearMockSession();
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
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

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
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiFileText} className="w-4 h-4 inline mr-2" />
              Content Management
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiUsers} className="w-4 h-4 inline mr-2" />
              Leads Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiSettings} className="w-4 h-4 inline mr-2" />
              Site Settings
            </button>
          </nav>
        </div>

        {/* Content Management Tab */}
        {activeTab === 'content' && (
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
                      <div className="flex-1">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Background Image URL</label>
                                <input
                                  type="url"
                                  value={editingSection.background_image || ''}
                                  onChange={(e) => setEditingSection({ ...editingSection, background_image: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                                <input
                                  type="url"
                                  value={editingSection.featured_image || ''}
                                  onChange={(e) => setEditingSection({ ...editingSection, featured_image: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>
                            </div>
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
                            <p className="text-gray-600 mb-4">{activeSection.subtitle}</p>
                            {activeSection.background_image && (
                              <div className="mb-2">
                                <span className="text-sm text-gray-500">Background Image: </span>
                                <span className="text-sm text-blue-600">{activeSection.background_image}</span>
                              </div>
                            )}
                            {activeSection.featured_image && (
                              <div className="mb-2">
                                <span className="text-sm text-gray-500">Featured Image: </span>
                                <span className="text-sm text-blue-600">{activeSection.featured_image}</span>
                              </div>
                            )}
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
                                type="url"
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
                            <div key={item.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
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
                                        type="url"
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
        )}

        {/* Leads Management Tab */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Leads Management</h2>
                <div className="text-sm text-gray-500">
                  Total Leads: {leads.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.interest}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full ${statusColors[lead.status] || 'bg-gray-100 text-gray-800'}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No leads found. Lead submissions will appear here.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Site Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Site Settings</h2>
                {editingSettings ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateSiteSettings}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiSave} className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setEditingSettings(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingSettings(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    <span>Edit Settings</span>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={siteSettings.company_name || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, company_name: e.target.value })}
                    disabled={!editingSettings}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiImage} className="w-4 h-4 inline mr-1" />
                    Site Logo URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.site_logo || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, site_logo: e.target.value })}
                    disabled={!editingSettings}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="https://example.com/logo.png"
                  />
                  {siteSettings.site_logo && (
                    <div className="mt-2">
                      <img src={siteSettings.site_logo} alt="Site Logo" className="h-16 w-auto" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiImage} className="w-4 h-4 inline mr-1" />
                    Hero Background Image URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.hero_background_image || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, hero_background_image: e.target.value })}
                    disabled={!editingSettings}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="https://example.com/hero-bg.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiImage} className="w-4 h-4 inline mr-1" />
                    Leadership Section Image URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.about_leadership_image || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, about_leadership_image: e.target.value })}
                    disabled={!editingSettings}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="https://example.com/leadership.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiImage} className="w-4 h-4 inline mr-1" />
                    Why Join Us Section Image URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.why_join_us_image || ''}
                    onChange={(e) => setSiteSettings({ ...siteSettings, why_join_us_image: e.target.value })}
                    disabled={!editingSettings}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="https://example.com/team.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;