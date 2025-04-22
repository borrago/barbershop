import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUsers, FaCut, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/appointments', label: 'Agendamentos', icon: <FaCalendarAlt /> },
    { path: '/clients', label: 'Clientes', icon: <FaUsers /> },
    { path: '/services', label: 'Serviços', icon: <FaCut /> },
    { path: '/users', label: 'Usuários', icon: <FaUsers /> },
    { path: '/settings', label: 'Configurações', icon: <FaCog /> },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Barbershop</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <button className="sidebar-link logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar; 