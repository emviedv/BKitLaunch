import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
        Admin Dashboard - Minimal Version
      </h1>
      <p style={{ color: '#666', fontSize: '16px' }}>
        This is an absolutely minimal admin dashboard with no React Hooks at all.
        If you see this page, it means the routing works and there are no React errors.
      </p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', border: '1px solid #ddd' }}>
        <p>✅ No useState</p>
        <p>✅ No useEffect</p>
        <p>✅ No custom hooks</p>
        <p>✅ No authentication</p>
        <p>✅ Pure functional component</p>
      </div>
      <a href="/" style={{ 
        display: 'inline-block', 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        textDecoration: 'none',
        borderRadius: '5px'
      }}>
        ← Go Home
      </a>
    </div>
  );
};

export default AdminDashboard;