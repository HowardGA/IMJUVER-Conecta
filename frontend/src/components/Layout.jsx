import React from 'react';
import Header from './Header'; 
import { Outlet } from 'react-router-dom'; 
import './Layout.css';

function Layout() {
  return (
    <div className="layout">
      <Header />
      <section>
        <Outlet /> 
      </section>
    </div>
  );
}

export default Layout;