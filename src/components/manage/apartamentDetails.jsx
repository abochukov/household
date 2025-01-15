import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as propertyService from '../../services/propertyService';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';


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
        phone_number: 'няма данни',
        resident1: '',
        resident2: '',
        resident3: '',
        resident4: '',
        resident5: '',
        resident6: '',
        birthday1: '',
        birthday2: '',
        birthday3: '',
        birthday4: '',
        birthday5: '',
        birthday6: ''
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
                    role: fetchedData.role ?? '',
                    resident1: fetchedData.resident1 || '',
                    resident2: fetchedData.resident2 || '',
                    resident3: fetchedData.resident3 || '',
                    resident4: fetchedData.resident4 || '',
                    resident5: fetchedData.resident5 || '',
                    resident6: fetchedData.resident6 || '',
                    birthday1: fetchedData.birthday1 || '',
                    birthday2: fetchedData.birthday2 || '',
                    birthday3: fetchedData.birthday3 || '',
                    birthday4: fetchedData.birthday4 || '',
                    birthday5: fetchedData.birthday5 || '',
                    birthday6: fetchedData.birthday6 || ''
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
        propertyService.updateProperty(id, formData)
            .then((data) => {

                const updatedData = {
                    ...formData, // Оставяме всички текущи стойности от formData
                    ...data // Актуализираме със стойностите от сървъра, ако има разлики
                };

                setApartament(updatedData);
                setFormData(updatedData);
                setIsEditing(false);

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
            })
            .catch((error) => {
                console.log("Error deleting apartment:", error);
            });
    }
    // Render loading state while data is being fetched
    if (loading) {
        return <div>Loading...</div>; // Show loading message or spinner
    }

    const renderResidentsAndBirthdays = () => {
        const residents = [
            { resident: apartament.resident1, birthday: apartament.birthday1, residentKey: 'resident1', birthdayKey: 'birthday1' },
            { resident: apartament.resident2, birthday: apartament.birthday2, residentKey: 'resident2', birthdayKey: 'birthday2' },
            { resident: apartament.resident3, birthday: apartament.birthday3, residentKey: 'resident3', birthdayKey: 'birthday3' },
            { resident: apartament.resident4, birthday: apartament.birthday4, residentKey: 'resident4', birthdayKey: 'birthday4' },
            { resident: apartament.resident5, birthday: apartament.birthday5, residentKey: 'resident5', birthdayKey: 'birthday5' },
            { resident: apartament.resident6, birthday: apartament.birthday6, residentKey: 'resident6', birthdayKey: 'birthday6' },
        ];
    
        return residents.map((item, index) => {
            if (item.resident || item.birthday) {
                return (
                    <tr key={index}>
                        <td>Обитател {index + 1}</td>
                        <td className="residents">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name={item.residentKey}
                                        value={formData[item.residentKey] || ''}
                                        onChange={handleInputChange}
                                        placeholder={`Enter resident ${index + 1}`}
                                    />
                                    <input
                                        type="date"
                                        name={item.birthdayKey}
                                        value={formData[item.birthdayKey] || ''}
                                        onChange={handleInputChange}
                                    />
                                    
                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteResident(index + 1)} className="delete-icon" alt="Изтрий" />

                                    {/* <Button variant="danger" onClick={() => handleDeleteResident(index + 1)}>
                                        Изтрий
                                    </Button> */}
                                </>
                            ) : (
                                <>
                                    {item.resident} - {item.birthday}
                                </>
                            )}
                        </td>
                    </tr>
                );
            }
            return null;
        });
    };

    const handleDeleteResident = (residentNumber) => {
        propertyService.updateResident(id, { residentNumber })
            .then((response) => {
                // Обнови данните с новите стойности (с NULL за съответния резидент)
                const updatedApartament = { ...apartament };
                updatedApartament[`resident${residentNumber}`] = null;
                updatedApartament[`birthday${residentNumber}`] = null;
                setApartament(updatedApartament);
                toast(`Резидент ${residentNumber} е изтрит успешно`);
            })
            .catch((error) => {
                console.error("Error deleting resident:", error);
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
                style={{zIndex: 99999}}
                toastStyle={{ backgroundColor: "green", color: 'white' }}
            />
            <table>
                <thead>
                    <tr>
                        <th colSpan={2}>Aпартамент {apartament.property_number}</th>
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
                    
                    {renderResidentsAndBirthdays()}

                    <tr>
                        <td>
                        <Button variant="danger" onClick={() => handleDeleteClick(apartament.property_id)}>
                                Изтрий
                            </Button>
                            
                        </td>
                        <td style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button variant="primary" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Отхвърляне' : 'Редактиране'}
                            </Button>

                            {isEditing && (
                                <Button variant="primary" onClick={handleSave}>Запази промените</Button>
                            )}
                            
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
                        
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default ApartamentDetails;
