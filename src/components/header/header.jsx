import React, {useState, useEffect, iseRef, useRef} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';


import './header.scss';

const Header = () => {

    const [userDropdownVisible, setUserDropdownVisible] = useState(false);
    const userDropdownRef = useRef(null);
    const userIconRef = useRef(null);
    const navigate = useNavigate();

    const handleUserClick = () => {
        setUserDropdownVisible(!userDropdownVisible);
    }

    const handleUserClickOutside = (event) => {
        if(userDropdownRef.current && !userDropdownRef.current.contains(event.target) && !userIconRef.current.contains(event.target)) {
            setUserDropdownVisible(false);
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleUserClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleUserClickOutside)
        };
    }, [])

    return(
        <div className="header-wrapper">
            <div className='toolbar-panel'>
                <ul className="toolbar">
                    <li>
                        <FontAwesomeIcon icon={faUser} ref={userIconRef} onClick={handleUserClick} />
                        {userDropdownVisible && (
                            <div className="dropdown" ref={userDropdownRef}>
                                <ul>
                                    <li>Option 1</li>
                                    <li onClick={handleSignOut}>Излизане</li>
                                </ul>
                            </div>
                        )}
                    </li>
                    <li><FontAwesomeIcon icon={faBell} /></li>
                    <li><FontAwesomeIcon icon={faGear} /></li>
                </ul>
            </div>
        </div>
    )
}

export default Header;