import React, { useState, useEffect } from 'react';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('Sample content');

  // Simple useEffect with empty dependency array
  useEffect(() => {
    console.log('AdminDashboard mounted - no auth required');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">No authentication required - simplified version</p>
            </div>
            <a href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded">
              ← Go Home
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Dashboard Content</h2>
          <p className="text-gray-600 mb-4">This is a simplified admin dashboard with no authentication.</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sample Content:</label>
            <input 
              type="text" 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button 
            onClick={() => setLoading(!loading)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Loading...' : 'Toggle Loading State'}
          </button>
          
          {loading && (
            <div className="mt-4 text-gray-600">
              Loading state is active...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;