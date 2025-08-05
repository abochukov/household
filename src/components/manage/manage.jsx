import { useState, useEffect } from "react";
import React from 'react';

import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import axios from 'axios';

import ApartamentListItem from "./apartamentListItem";

import './manage.scss'
import CreateProperty from "./createProperty";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import * as propertyService from '../../services/propertyService';

const Manage = () => {
    const [apartaments, setApartaments] = useState([]);
    const [isVisible, setVisible] = useState(false);
    
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    
    const notify = () => toast("Wow so easy!");
    
    function click(e) {
        e.preventDefault();
        setVisible(true);
    }

    useEffect(() => {
        const username = localStorage.getItem('username');
    
        if (username) {
            propertyService.getAll(username)
                .then((data) => {
                    setApartaments(data);
                },
                (error) => {
                    console.error('Error:', error);
                    toast("Възникна проблем със сървъра! Моля, опитайте по-късно!");
                });
        } else {
            toast("Не сте влезли в системата!");
        }
    }, []);

    useEffect(() => {
        const username = localStorage.getItem('username');
    
        if (username) {
            propertyService.getAddressesPerUser(username)
                .then((data) => {
                    setAddress(data);
                },
                (error) => {
                    console.error('Error:', error);
                    toast("Възникна проблем със сървъра! Моля, опитайте по-късно!");
                });
        } else {
            toast("Не сте влезли в системата!");
        }
    }, []);

    const handleSelectChange = (event) => {
        console.log(event)
        setSelectedAddress(event.target.value);
    };
    

    return(
        <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{zIndex: 99999}}
            toastStyle={{ backgroundColor: "red", color: 'white' }}
        />

        {/* <Button as={Link} to={`/createAddress`} variant="primary" className="create-property-btn">Създай нов адрес</Button>
        <Button as={Link} to={`/createProperty`} variant="primary" className="create-property-btn">Създай нов апартамент</Button> */}

            {/* <div>
                <label htmlFor="addressDropdown">Select Address:</label>
                <select
                    id="addressDropdown"
                    value={selectedAddress}
                    onChange={handleSelectChange}
                >
                    <option value="">-- Select Address --</option>
                    {address.length > 0 ? (
                        address.map((addressItem, index) => (
                            <option key={index} value={addressItem.address_id}>
                                {addressItem.city}, {addressItem.address}, Вход {addressItem.entrance}
                            </option>
                        ))
                    ) : (
                        <option value="">No addresses available</option>
                    )}
                </select>
            </div> */}

            <div>
                {/* Show the selected address */}
                {selectedAddress && (
                    <p>You selected: {selectedAddress}</p>
                )}
            </div>

        <div className="apartament-list">
            {apartaments.map((apartament, index) =>
                <ApartamentListItem key={apartament?.property_id} id={index + 1} {...apartament} />
            )}
        </div>

        { isVisible && (
            <CreateProperty />
        )
        }
        </>
    );
}

export default Manage;