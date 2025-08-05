import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faWrench, faHouseFire, faMoneyBill, faUser, faRightFromBracket, faBarsProgress, faBars } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation } from 'react-router-dom';

import './sidebar.scss';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Close sidebar on login/signup route
  React.useEffect(() => {
    if (
      location.pathname === '/login' ||
      location.pathname === '/signup' ||
      location.pathname === '/'
    ) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      {!isOpen && (
        <div className="hamburger-menu" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      )}

      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink to="/home" activeClassName="active-link" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faHouse} />
              <span>Начало</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/createAddress" activeClassName="active-link" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faWrench} />
              <span>Нов адрес</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/createProperty" activeClassName="active-link" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faHouseFire} />
              <span>Нов обект</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage" activeClassName="active-link" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faBarsProgress} />
              <span>Управление</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/checkout" activeClassName="active-link" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faMoneyBill} />
              <span>Каса</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/profile" activeClassName="active-link" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faUser} />
              <span>Профил</span>
            </NavLink>
          </li>
          <li>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Изход</span>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default SideBar;