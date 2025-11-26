import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faDumbbell,
  faUsers,
  faCheckCircle,
  faCreditCard,
  faIdCard,
  faChartBar,
  faCog,
  faChevronLeft,
  faChevronRight,
  faSignOutAlt,
  faDumbbell as faDumbbellIcon,
  faChevronDown,
  faChevronUp,
  faCircle,
  faGauge,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (label, e) => {
    if (isCollapsed) {
        setIsCollapsed(false);
        // Add a small delay to let the sidebar expand before opening submenu
        setTimeout(() => {
            setExpandedMenus(prev => ({
                ...prev,
                [label]: !prev[label]
            }));
        }, 300);
    } else {
        setExpandedMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: faGauge },
    { 
      label: 'Members', 
      icon: faUsers,
      subItems: [
        { label: 'New Member', path: '/admin/members/add' },
        { label: 'View Member', path: '/admin/view-members' },
        { label: 'All Members', path: '/admin/members?status=all' },
        { label: 'Active Members', path: '/admin/members?status=active' },
        { label: 'Inactive Members', path: '/admin/members?status=inactive' },
        { label: 'Dues', path: '/admin/members?status=expired' },
      ]
    },
    { 
      label: 'Employees',
      icon: faDumbbell,
      subItems: [
        { label: 'New Employee', path: '/admin/employees/add' },
        { label: 'View Employee', path: '/admin/employees' },
        { label: 'All Employee', path: '/admin/employees/list?status=all' },
      ]
    },
    { 
      label: 'Attendance', 
      icon: faCheckCircle,
      subItems: [
        { label: 'Member Attendance', path: '/admin/attendance/members' },
        { label: 'Employee Attendance', path: '/admin/attendance/employees' },
      ]
    },
    { path: '/admin/payments', label: 'Payments', icon: faCreditCard },
    { path: '/admin/memberships', label: 'Memberships', icon: faIdCard },
    { path: '/admin/whatsapp', label: 'WhatsApp', icon: faWhatsapp },
    { path: '/admin/reminders', label: 'Reminders', icon: faBell },
    { path: '/admin/analytics', label: 'Analytics', icon: faChartBar },
    { 
      label: 'Settings', 
      icon: faCog,
      subItems: [
        { label: 'Manage Plans', path: '/admin/manage-plans' },
        { label: 'Change Password', path: '/admin/change-password' },
      ]
    },
  ];

  // Update parent layout class when sidebar state changes
  useEffect(() => {
    const layout = document.querySelector('.admin-layout');
    if (layout) {
      if (isCollapsed) {
        layout.classList.add('sidebar-collapsed');
      } else {
        layout.classList.remove('sidebar-collapsed');
      }
    }
  }, [isCollapsed]);

  // Auto-expand submenu if current path matches
  useEffect(() => {
    if (!isCollapsed) {
        menuItems.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(sub => {
                   // Check if path matches
                   return location.pathname === sub.path.split('?')[0];
                });
                if (isActive) {
                    setExpandedMenus(prev => ({ ...prev, [item.label]: true }));
                }
            }
        });
    }
  }, [location.pathname, isCollapsed]);

  const renderMenuItem = (item) => {
    const isExpanded = expandedMenus[item.label];
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    // Check if any sub-item is active
    const isSubActive = hasSubItems && item.subItems.some(sub => {
        const subPath = sub.path.split('?')[0];
        return location.pathname === subPath;
    });

    const isActive = !hasSubItems && location.pathname === item.path;
    
    if (hasSubItems) {
        return (
            <div key={item.label} className="nav-item-wrapper">
                <div 
                    className={`nav-item has-submenu ${isSubActive ? 'active' : ''}`}
                    onClick={(e) => toggleSubmenu(item.label, e)}
                    title={isCollapsed ? item.label : ''}
                >
                    <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                    {!isCollapsed && (
                        <>
                            <span className="nav-label">{item.label}</span>
                            <FontAwesomeIcon 
                                icon={isExpanded ? faChevronUp : faChevronDown} 
                                className="submenu-arrow" 
                            />
                        </>
                    )}
                </div>
                {!isCollapsed && isExpanded && (
                    <div className="submenu">
                        {item.subItems.map(sub => {
                             // Check if this specific sub-item is active including query params
                             const isCurrentSubActive = location.pathname + location.search === sub.path;
                             
                             return (
                                <Link
                                    key={sub.label}
                                    to={sub.path}
                                    className={`submenu-item ${isCurrentSubActive ? 'active' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faCircle} className="submenu-icon" />
                                    <span>{sub.label}</span>
                                </Link>
                             );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
            onClick={(e) => {
              // Don't expand sidebar when clicking links while collapsed
              e.stopPropagation();
            }}
          >
            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
    );
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!isCollapsed && <FontAwesomeIcon icon={faDumbbellIcon} className="logo-icon" />}
          {!isCollapsed && <h2>GYM Manager</h2>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(renderMenuItem)}
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn" title={isCollapsed ? 'Logout' : ''}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
