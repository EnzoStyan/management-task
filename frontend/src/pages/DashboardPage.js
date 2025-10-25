import React from 'react';

function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      {/* Daftar task dan fitur lain akan dibuat di sini */}
      <button
        onClick={() => {
          localStorage.removeItem('token'); 
          window.location.href = '/login';
        }}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout (Sementara)
      </button>
    </div>
  );
}

export default DashboardPage;