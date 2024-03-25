// import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

import './header.scss';

const Header = () => {
    return(
        <div className="header-wrapper">
            <div className='toolbar-panel'>
                <ul className="toolbar">
                    <li><FontAwesomeIcon icon={faUser} /></li>
                    <li><FontAwesomeIcon icon={faBell} /></li>
                    <li><FontAwesomeIcon icon={faGear} /></li>
                </ul>
            </div>
        </div>
    )
}

export default Header;