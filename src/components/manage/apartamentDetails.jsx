import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as propertyService from '../../services/propertyService';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './manage.scss';

const ApartamentDetails = () => {
    const { id } = useParams();
    const [apartament, setApartament] = useState({
        city: 'няма данни',
        address: 'няма данни',
        floor: 'няма данни',
        area: 'няма данни',
        member_amount: 'няма данни',
        pets: 'няма данни',
        rent: 'няма данни',
        username: 'няма данни',
        property_number: 'няма данни',
        email: 'няма данни',
        phone_number: 'няма данни'
    }); // Default values

    const [isEditing, setIsEditing] = useState(false); // Toggle between view/edit mode
    const [loading, setLoading] = useState(true); // Track loading state
    const [showModal, setShowModal] = useState(false);
    const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);
    const [formData, setFormData] = useState({
        city: '',
        address: '',
        floor: '',
        area: '',
        member_amount: '',
        pets: '',
        rent: '',
        username: '',
        email: '',
        phone: '',
        role: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Log the API call response to check the data
        propertyService.singleProperty(id)
            .then((data) => {
                console.log("Fetched data:", data); // Check what the data looks like

                // If data is an array, take the first element, otherwise use data directly
                const fetchedData = Array.isArray(data) ? data[0] : data;
                
                // Update state with fetched data
                setApartament(fetchedData);
                setFormData({
                    city: fetchedData.city ?? '',
                    address: fetchedData.address ?? '',
                    floor: fetchedData.floor ?? '',
                    area: fetchedData.area ?? '',
                    member_amount: fetchedData.member_amount ?? '',
                    pets: fetchedData.pets ?? '',
                    rent: fetchedData.rent ?? '',
                    username: fetchedData.username ?? '',
                    email: fetchedData.email ?? '',
                    phone: fetchedData.phone ?? '',
                    role: fetchedData.role ?? ''
                });

                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching apartment details", error);
                setLoading(false); // Ensure loading is false even on error
            });
    }, [id]);

    const handleDeleteClick = (id) => {
        setPropertyIdToDelete(id);
        setShowModal(true); 
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = () => {
        console.log(id, formData)
        propertyService.updateProperty(id, formData)
            .then((data) => {
                setApartament(data);
                setIsEditing(false); // Exit edit mode
                toast("Успешно запазихте промените");
            })
            .catch((error) => {
                console.error("Error saving apartment details", error);
            });
    };

    const deleteProperty = () => {
        propertyService.deleteProperty(propertyIdToDelete)
            .then((response) => {
                console.log("Property deleted successfully:", response);
                navigate('/manage')
                // setProperties(prevProperties => prevProperties.filter(property => property.property_id !== id));
            })
            .catch((error) => {
                console.log("Error deleting apartment:", error);
                alert("Failed to delete property.");
            });
    }
    // Render loading state while data is being fetched
    if (loading) {
        return <div>Loading...</div>; // Show loading message or spinner
    }

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
                style={{zIndex: 99999}}
                toastStyle={{ backgroundColor: "green", color: 'white' }}
            />
            <table>
                <thead>
                    <tr>
                        <th>Aпартамент {apartament.property_number}</th>
                        <th style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button variant="primary" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel' : 'Редактиране'}
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteClick(apartament.property_id)}>
                                Изтрий
                            </Button>

                            {showModal && (
                                <Modal
                                    show={showModal}
                                    onHide={handleCancelDelete}
                                    backdrop="static"
                                    keyboard={false}
                                    style={{zIndex: '99999'}}
                                >
                                    <Modal.Header closeButton>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Сигурни ли сте, че искате да изтриете апартамент номер {apartament.property_number}?
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCancelDelete}>
                                            Затвори
                                        </Button>
                                        <Button variant="danger" onClick={deleteProperty}>Изтрий</Button>
                                    </Modal.Footer>
                                </Modal>
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Град</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.city
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Адрес</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.address
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Етаж</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.floor
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Квадратура</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.area
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Брой живущи</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="member_amount"
                                    value={formData.member_amount}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.member_amount
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Домашни любимци</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="pets"
                                    value={formData.pets}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.pets
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Под наем</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="rent"
                                    value={formData.rent}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.rent
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Потребителско име</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.username
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.email
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Тип потребител</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.role
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Телефонен номер</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.phone
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            {isEditing && (
                <button onClick={handleSave}>Save</button>
            )}
        </>
    );
};

export default ApartamentDetails;
