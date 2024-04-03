import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faWrench, faHouseFire, faMoneyBill, faUser, faRightFromBracket, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

import { Link } from 'react-router-dom';
// import { Manage } from '../manage/manage';

import './sidebar.scss';

const SideBar = () => {
  return (
    <div className="sidebar-container">
      <ul>
        <li><Link to="/home"><FontAwesomeIcon as={Link} to="/" icon={faHouse} /><span>Начало</span></Link></li>
        <li><Link to="/manage"><FontAwesomeIcon icon={faBarsProgress} /> <span>Управление</span></Link></li>
        <li><Link to="/events"><FontAwesomeIcon icon={faWrench} /><span>Събития</span></Link></li>
        <li><Link to="/emergency"><FontAwesomeIcon icon={faHouseFire} /><span>Аварии</span></Link></li>
        <li><Link to="/checkout"><FontAwesomeIcon icon={faMoneyBill} /><span>Каса</span></Link></li>
        <li><Link to="/profile"><FontAwesomeIcon icon={faUser} /><span>Профил</span></Link></li>
        <li><FontAwesomeIcon icon={faRightFromBracket} /><span>Изход</span></li>
      </ul>
    </div>
  );
};

export default SideBar;