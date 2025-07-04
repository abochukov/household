import React, { useEffect, useState } from "react";
import * as addressService from '../../services/addressService';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes, faEdit, faSave, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import './manage.scss';

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
    const [showModal, setShowModal] = useState(false);
    const [addressIdToDelete, setAddressIdToDelete] = useState(null);



    const [errors, setErrors] = useState({
        city: '',
        address: '',
        entranceId: '',
    });

    useEffect(() => {
        const username = localStorage.getItem('username');
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
            addressService.updateAddress(selectedAddress.address_id, updatedFormValues)
                .then(() => {
                    toast.success("Адресът беше успешно актуализиран");
    
                    // Update the addresses in the local state to reflect the changes
                    // setAddresses(prevAddresses => 
                    //     prevAddresses.map(address => 
                    //         address.id === selectedAddress.address_id ? { ...address, ...updatedFormValues } : address
                    //     )
                    // );

                    setAddresses(prevAddresses => prevAddresses.map(address =>
                        address.address_id === selectedAddress.address_id
                            ? { ...address, ...updatedFormValues }
                            : address
                    ));
    
                    setSelectedAddress(null);
                    setFormValues(formInitialState);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Грешка при актуализиране на адреса");
                });
        } else {
            addressService.createAddress(updatedFormValues)
                .then((newAddress) => {
                    toast.success("Успешно създадохте нов адрес");
    
                    setAddresses(prevAddresses => [...prevAddresses, newAddress]);
                    
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

    const handleDeleteClick = (id) => {
        setAddressIdToDelete(id);
        setShowModal(true);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    const handleDelete = () => {
        addressService.deleteAddress(addressIdToDelete)
            .then(() => {
                setAddresses((prevAddresses) => {
                    const updatedAddresses = prevAddresses.filter(address => address.address_id !== addressId);
                    return updatedAddresses;
                });
                setShowModal(false);

                toast.success("Адресът беше успешно изтрит");
            })
            .catch((error) => {
                console.error("Error deleting address:", error);
                toast.error("Грешка при изтриване на адреса");
            });
    };
    
    return (
        <>
            <Form className="row">
                <div className="title">Вашите адреси</div>
                <Form.Group className="existing-addresses col-lg-12">
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
                                        <div className="create-address-service-buttons">
                                            {/* <Button variant="warning" onClick={() => handleEdit(address)}>Редактиране</Button>
                                            <Button variant="danger" onClick={() => handleDeleteClick(address.address_id)} style={{marginLeft: '20px'}}>Изтриване</Button> */}

                                            <Button className="custom-btn" onClick={() => handleEdit(address)}>Редактиране</Button>
                                            <Button className="custom-btn-danger" onClick={() => handleDeleteClick(address.address_id)} style={{marginLeft: '20px'}}>Изтриване</Button>

                                            {showModal && (
                                                <Modal
                                                    show={showModal}
                                                    onHide={handleCancelDelete}
                                                    backdrop="static"
                                                    keyboard={false}
                                                    style={{ zIndex: '99999' }}
                                                >
                                                    <Modal.Header closeButton>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        Сигурни ли сте, че искате да изтриете адрес {address.address}?
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleCancelDelete}>
                                                            Затвори
                                                        </Button>
                                                        <Button variant="danger" onClick={handleDelete}>
                                                            Изтрий
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Form.Group>
                
                <div className="row create-address-form">
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

                    {/* <Button type='button' variant="success" onClick={submitHandler} disabled={isSaveButtonDisabled}>
                        {selectedAddress ? "Запази промените" : "Запази"}
                    </Button> */}
                    
                    <Button className="custom-btn-success" onClick={submitHandler} disabled={isSaveButtonDisabled}>
                        {selectedAddress ? "Запази промените" : "Запази"}
                    </Button>

                </div>
            </Form>
        </>
    );
};

export default CreateAddress;
