import { useEffect, useState } from "react";
import * as addressService from '../../services/addressService';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formInitialState = {
    city: '',
    neighbourhood: '',
    address: '',
    entranceId: '',
};

const CreateAddress = () => {
    const [formValues, setFormValues] = useState(formInitialState);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [errors, setErrors] = useState({
        city: '',
        address: '',
        entranceId: '',
    });

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            addressService.getAddresses(username)  // Use the service method to fetch addresses
                .then(response => {
                    setAddresses(response);
                })
                .catch(error => {
                    console.error('Error fetching addresses:', error);
                    toast("Грешка при зареждане на адресите");
                });
        }
    }, []);

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const emptyFieldValidation = () => {
        let validationErrors = {};
        let isValid = true;

        if (!formValues.city) {
            validationErrors.city = 'Моля, въведете град';
            isValid = false;
        } else {
            validationErrors.city = '';
        }

        if (!formValues.address) {
            validationErrors.address = 'Моля, въведете точен адрес';
            isValid = false;
        } else {
            validationErrors.address = '';
        }

        if (!formValues.entranceId) {
            validationErrors.entranceId = 'Моля, въведете вход';
            isValid = false;
        } else {
            validationErrors.entranceId = '';
        }

        setErrors(validationErrors);
        setIsSaveButtonDisabled(!isValid);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const username = localStorage.getItem('username');
        const updatedFormValues = {
            ...formValues,
            created_by: username
        };
    
        if (selectedAddress) {
            // Update existing address
            addressService.updateAddress(selectedAddress.address_id, updatedFormValues)
                .then(() => {
                    toast.success("Адресът беше успешно актуализиран");
    
                    // Update the addresses in the local state to reflect the changes
                    setAddresses(prevAddresses => 
                        prevAddresses.map(address => 
                            address.id === selectedAddress.address_id ? { ...address, ...updatedFormValues } : address
                        )
                    );
    
                    // Reset the form after update
                    setSelectedAddress(null);
                    setFormValues(formInitialState);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Грешка при актуализиране на адреса");
                });
        } else {
            // Create new address
            addressService.createAddress(updatedFormValues)
                .then((newAddress) => {
                    toast.success("Успешно създадохте нов адрес");
    
                    // Add the new address to the state immediately
                    setAddresses(prevAddresses => [...prevAddresses, newAddress]);
                    
                    // Reset the form after successful creation
                    setFormValues(formInitialState);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Грешка при създаване на адрес");
                });
        }
    };
    
    

    const handleEdit = (address) => {
        console.log(address)
        setFormValues({
            city: address.city,
            neighbourhood: address.neighbourhood,
            address: address.address,
            entranceId: address.entrance,
        });
        setSelectedAddress(address);
    };

    const handleDelete = (addressId) => {
        addressService.deleteAddress(addressId)
            .then(() => {
                // Assuming 'address_id' is the actual identifier
                setAddresses((prevAddresses) => {
                    const updatedAddresses = prevAddresses.filter(address => address.address_id !== addressId);
                    return updatedAddresses;
                });
                toast.success("Адресът беше успешно изтрит");
            })
            .catch((error) => {
                console.error("Error deleting address:", error);
                toast.error("Грешка при изтриване на адреса");
            });
    };
    
    return (
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
                style={{ zIndex: 99999 }}
                toastStyle={{ backgroundColor: "#72AA37", color: 'white' }}
            />
            <Form className="row">
                <div className="title">Вашите адреси</div>
                <Form.Group className="col-lg-12">
                    <table>
                        <thead>
                            <tr>
                                <th className="col-lg-3">Град</th>
                                <th className="col-lg-3">Адрес</th>
                                <th className="col-lg-3">Дата на създаване</th>
                                <th className="col-lg-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addresses.map((address, index) => (
                                <tr key={index}>
                                    <td className="col-lg-3">{address.city}, {address.neighbourhood}</td>
                                    <td className="col-lg-3">{address.address}, Вход: {address.entrance}</td>
                                    <td className="col-lg-3">{new Date(address.created_at).toLocaleDateString()}</td>
                                    <td className="col-lg-3">
                                        <Button variant="warning" onClick={() => handleEdit(address)}>Редактиране</Button>
                                        <Button variant="danger" onClick={() => handleDelete(address.address_id)}>Изтриване</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Form.Group>

                <div className="title">{selectedAddress ? "Редактиране на адрес" : "Създаване на нов адрес"}</div>

                <Form.Group className="col-lg-6">
                    <Form.Label>Град <span className="required-field">*</span></Form.Label>
                    <Form.Control id='city' type='text' name="city" value={formValues.city} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.city ? 'is-invalid' : ''} />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </Form.Group>

                <Form.Group className="col-lg-6">
                    <Form.Label>Квартал</Form.Label>
                    <Form.Control id='neighbourhood' type='text' name="neighbourhood" value={formValues.neighbourhood} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.neighbourhood ? 'is-invalid' : ''} />
                    {errors.neighbourhood && <div className="invalid-feedback">{errors.neighbourhood}</div>}
                </Form.Group>

                <Form.Group className="col-lg-6">
                    <Form.Label>Адрес <span className="required-field">*</span></Form.Label>
                    <Form.Control id='address' type='text' name="address" value={formValues.address} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.address ? 'is-invalid' : ''} />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </Form.Group>

                <Form.Group className="col-lg-6">
                    <Form.Label>Вход <span className="required-field">*</span></Form.Label>
                    <Form.Control id='entranceId' type='text' name="entranceId" value={formValues.entranceId} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.entranceId ? 'is-invalid' : ''} />
                    {errors.entranceId && <div className="invalid-feedback">{errors.entranceId}</div>}
                </Form.Group>

                <Button type='button' variant="success" onClick={submitHandler} disabled={isSaveButtonDisabled}>
                    {selectedAddress ? "Запази промените" : "Запази"}
                </Button>
            </Form>
        </>
    );
};

export default CreateAddress;
