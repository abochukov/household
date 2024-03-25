import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faWrench, faHouseFire, faMoneyBill, faUser, faRightFromBracket, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

import './sidebar.scss';

const SideBar = () => {
  return (
    <div className="sidebar-container">
      <ul>
        <li><FontAwesomeIcon icon={faHouse} /><span>Начало</span></li>
        <li><FontAwesomeIcon icon={faBarsProgress} /> <span>Управление</span></li>
        <li><FontAwesomeIcon icon={faWrench} /><span>Събития</span></li>
        <li><FontAwesomeIcon icon={faHouseFire} /><span>Аварии</span></li>
        <li><FontAwesomeIcon icon={faMoneyBill} /><span>Каса</span></li>
        <li><FontAwesomeIcon icon={faUser} /><span>Профил</span></li>
        <li><FontAwesomeIcon icon={faRightFromBracket} /><span>Изход</span></li>
      </ul>
    </div>
  );
};

export default SideBar;