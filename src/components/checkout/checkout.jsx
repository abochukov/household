import { useEffect, useState } from "react";

import Form from 'react-bootstrap/Form';
import * as addressService from '../../services/addressService';
import * as cashService from '../../services/cashService';
import Button from 'react-bootstrap/Button';

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const username = localStorage.getItem('username');
        setUsername(username);
        if (username) {
            addressService.getAddresses(username)
                .then(response => {
                    setAddresses(response);
                })
                .catch(error => {
                    console.error('Error fetching addresses:', error);
                    toast("Грешка при зареждане на адресите");
                });
        }
    }, []);

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);
    };

    const handleNewModel = () => {
        if (!selectedAddress) {
            alert("Моля, изберете адрес.");
            return;
        }
        console.log(selectedAddress)
        cashService.getAllResidentsForAddress(username, selectedAddress.address_id)
            .then(response => {
                console.log('Нов модел създаден успешно:', response);
                // Можеш да покажеш съобщение или да обновиш UI
            })
            .catch(error => {
                console.error('Грешка при създаване на нов модел:', error);
                toast("Грешка при създаване на нов модел.");
            });
    
        setActiveSection('new-model');
    };

    
    
    return(
        <>
            <Form.Group className="col-lg-12 address-list">
                <Form.Label>Изберете адрес</Form.Label>
                <div>
                    {addresses.map((address, index) => (
                        <Form.Check
                            key={index}
                            type="radio"
                            label={address.address}
                            value={address.address}
                            checked={selectedAddress?.address === address.address}
                            onChange={() => handleAddressSelection(address)}
                        />
                    ))}
                </div>
            </Form.Group>

            <div className="buttons" style={{ display: 'flex', flexDirection:'row', justifyContent:'spaceAround', marginTop: '1rem' }}>
                <Button variant="outline-primary" onClick={() => setActiveSection('reports')} style={{width: '20%', marginRight: '2rem'}}>Справки</Button>{' '}
                <Button variant="outline-primary" onClick={handleNewModel} style={{width: '20%'}}>Нов модел</Button>
            </div>

            {activeSection === 'reports' && (
                <div style={{ marginTop: '1rem' }}>
                    <p>Тук ще се покажат справки по адреса.</p>
                </div>
            )}

            {activeSection === 'new-model' && (
                <div style={{ marginTop: '1rem' }}>
                    <p>Тук ще се създаде нов модел за избрания адрес.</p>
                </div>
            )}
        </>
    );
}

export default Checkout;