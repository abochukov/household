import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faWrench, faHouseFire, faMoneyBill, faUser, faRightFromBracket, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import './sidebar.scss';

const SideBar = () => {
  return (
    <div className="sidebar-container">
      <ul>
      <li>
          <NavLink to="/home" activeClassName="active-link">
            <FontAwesomeIcon icon={faHouse} />
            <span>Начало</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/createAddress" activeClassName="active-link">
            <FontAwesomeIcon icon={faWrench} />
            <span>Нов адрес</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/createProperty" activeClassName="active-link">
            <FontAwesomeIcon icon={faHouseFire} />
            <span>Нов обект</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/manage" activeClassName="active-link">
            <FontAwesomeIcon icon={faBarsProgress} />
            <span>Управление</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/checkout" activeClassName="active-link">
            <FontAwesomeIcon icon={faMoneyBill} />
            <span>Каса</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" activeClassName="active-link">
            <FontAwesomeIcon icon={faUser} />
            <span>Профил</span>
          </NavLink>
        </li>
        <li>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Изход</span>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;