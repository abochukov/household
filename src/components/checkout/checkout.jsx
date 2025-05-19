import { useEffect, useState } from "react";

import Form from 'react-bootstrap/Form';
import * as addressService from '../../services/addressService';
import Button from 'react-bootstrap/Button';

const Checkout = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            addressService.getAddresses(username)
                .then(response => {
                    console.log(response)
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
        setFormValues({
            ...formValues,
            city: address.city,
            address: address.address,
            neighbourhood: address.neighbourhood,
            entranceId: address.entrance
        });
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
        </>
    );
}

export default Checkout;