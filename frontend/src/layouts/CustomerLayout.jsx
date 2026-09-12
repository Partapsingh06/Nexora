import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-nexora-grayBg text-nexora-dark antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
