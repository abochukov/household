import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as propertyService from '../../services/propertyService';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';

import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes, faEdit, faSave, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

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
        password: 'няма данни за паролата',
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
    const [newResidentCount, setNewResidentCount] = useState(0);
    const [loading, setLoading] = useState(true); // Track loading state
    const [showModal, setShowModal] = useState(false);
    const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);
    const [formData, setFormData] = useState({
        city: '',
        address: '',
        floor: '',
        area: '',
        property_number: '',
        member_amount: '',
        pets: '',
        rent: '',
        username: '',
        password: '',
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
                    neighbourhood: fetchedData.neighbourhood ?? '',
                    address: fetchedData.address ?? '',
                    floor: fetchedData.floor ?? '',
                    area: fetchedData.area ?? '',
                    property_number: fetchedData.property_number ?? '',
                    member_amount: fetchedData.member_amount ?? '',
                    rent: fetchedData.rent,
                    pets: fetchedData.pets,
                    username: fetchedData.username ?? '',
                    password: fetchedData.password ?? '',
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
        
        if (name === 'pets') {
            // Convert the value to a boolean directly for pets
            setFormData(prevState => ({
                ...prevState,
                [name]: value === 'true' ? true : false
            }));
        } else if (name === 'rent') {
            // Convert rent to a valid number, or keep it as string (if necessary)
            setFormData(prevState => ({
                ...prevState,
                [name]: value === 'true' ? true : false
            }));
        } else {
            // For other fields, just update the state as usual
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    
    const handleAddResident = () => {
        // Count the number of existing residents
        const currentResidents = [
            apartament.resident1, apartament.resident2, apartament.resident3,
            apartament.resident4, apartament.resident5, apartament.resident6
        ].filter(resident => resident).length; // Filter out any null/undefined residents

        // Only allow adding up to 6 residents
        if (currentResidents < 6) {
            const nextResidentIndex = currentResidents + 1;  // Start from the next resident index

            // Set the new keys dynamically based on the next available index
            const newResidentKey = `resident${nextResidentIndex}`;
            const newBirthdayKey = `birthday${nextResidentIndex}`;

            // Add the new resident inputs to the form data
            setFormData(prevState => ({
                ...prevState,
                [newResidentKey]: '',
                [newBirthdayKey]: ''
            }));

            // Increase the new resident count
            setNewResidentCount(prevCount => prevCount + 1);
        } else {
            console.log('Maximum 6 residents allowed');
        }
    };




    const handleSave = () => {
        const updatedFormData = {
            ...formData,
            pets: formData.pets === true ? true : false,  // Ensuring pets is a boolean
            rent: formData.rent === true ? true : false  // Ensuring pets is a boolean
        };

        console.log(updatedFormData);
    
        propertyService.updateProperty(id, updatedFormData)
            .then((data) => {
                const updatedData = {
                    ...updatedFormData,
                    ...data  // Merge with data from server if any
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

    if (loading) {
        return <div>Loading...</div>;
    }

    const renderResidentsAndBirthdays = () => {
        // Array of existing residents from the `apartament` data
        const residents = [
            { resident: apartament.resident1, birthday: apartament.birthday1, residentKey: 'resident1', birthdayKey: 'birthday1' },
            { resident: apartament.resident2, birthday: apartament.birthday2, residentKey: 'resident2', birthdayKey: 'birthday2' },
            { resident: apartament.resident3, birthday: apartament.birthday3, residentKey: 'resident3', birthdayKey: 'birthday3' },
            { resident: apartament.resident4, birthday: apartament.birthday4, residentKey: 'resident4', birthdayKey: 'birthday4' },
            { resident: apartament.resident5, birthday: apartament.birthday5, residentKey: 'resident5', birthdayKey: 'birthday5' },
            { resident: apartament.resident6, birthday: apartament.birthday6, residentKey: 'resident6', birthdayKey: 'birthday6' },
        ];

        // Count the number of existing residents (those with data in `resident` or `birthday`)
        const currentResidentCount = residents.filter(item => item.resident || item.birthday).length;

        // Map over the existing residents and render them
        const allResidents = residents.map((item, index) => {
            // Only render resident if there's any data (resident or birthday)
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
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        onClick={() => handleDeleteResident(index + 1)}
                                        className="delete-icon"
                                        alt="Изтрий"
                                    />
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
            return null; // Skip rendering if no resident or birthday data
        });

        // Render the new resident inputs dynamically
        // Add new residents starting from the next available index
        for (let i = 0; i < newResidentCount; i++) {
            const nextResidentIndex = currentResidentCount + i + 1; // Ensure the new resident is numbered correctly
            allResidents.push(
                <tr key={`new-resident-${nextResidentIndex}`}>
                    <td>Обитател {nextResidentIndex}</td>
                    <td className="residents">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    name={`resident${nextResidentIndex}`}
                                    value={formData[`resident${nextResidentIndex}`] || ''}
                                    onChange={handleInputChange}
                                    placeholder={`Enter resident ${nextResidentIndex}`}
                                />
                                <input
                                    type="date"
                                    name={`birthday${nextResidentIndex}`}
                                    value={formData[`birthday${nextResidentIndex}`] || ''}
                                    onChange={handleInputChange}
                                />
                            </>
                        ) : (
                            <>
                                {formData[`resident${nextResidentIndex}`]} - {formData[`birthday${nextResidentIndex}`]}
                            </>
                        )}
                    </td>
                </tr>
            );
        }

        return allResidents;
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

    const numberOfResidents = [
        apartament.resident1, apartament.resident2, apartament.resident3,
        apartament.resident4, apartament.resident5, apartament.resident6
    ].filter(resident => resident).length;

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
                        <td>Квартал</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="neighbourhood"
                                    value={formData.neighbourhood}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.neighbourhood
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
                        <td>Номер на апартамент</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="property_number"
                                    value={formData.property_number}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.property_number
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
                                apartament.area + ' кв.м.'
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
                        <td>Домашни любимци{formData.pets}</td>
                        
                        <td>
                            {isEditing ? (
                                <div>
                                    <select
                                        name="pets"
                                        value={formData.pets}  // This will be true or false
                                        onChange={handleInputChange}
                                    >
                                        <option value={true}>true</option>
                                        <option value={false}>false</option>
                                    </select>
                                </div>
                            ) : (
                                apartament.pets  // Display 'Yes' or 'No' when not editing
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Под наем{formData.rent}</td>
                        <td>
                            {isEditing ? (
                                <div>
                                    <select
                                        name="rent"
                                        value={formData.rent}  // This will be true or false
                                        onChange={handleInputChange}
                                    >
                                        <option value={true}>true</option>
                                        <option value={false}>false</option>
                                    </select>
                                </div>
                            ) : (
                                apartament.rent  // Display 'Yes' or 'No' when not editing
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
                        <td>
                            Парола
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip id="button-tooltip-2">Check out this avatar</Tooltip>}
                                >
                                {({ ref, ...triggerHandler }) => (
                                    <Button
                                    variant="light"
                                    {...triggerHandler}
                                    className="d-inline-flex align-items-center"
                                    >
                                        <FontAwesomeIcon icon={faCircleInfo} ref={ref} style={{ marginRight: '8px' }} />
                                    {/* <span className="ms-1">Hover to see</span> */}
                                    </Button>
                                )}
                            </OverlayTrigger>
                        </td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                apartament.password
                            )}
                        </td>
                    </tr>
                    

                    {renderResidentsAndBirthdays()}

                    <tr>
                        <td>
                            <Button variant="danger" onClick={() => handleDeleteClick(apartament.property_id)}>
                                <FontAwesomeIcon icon={faTrash} style={{ paddingRight: '8px' }} />
                                Изтрий
                            </Button>
                        </td>
                        <td>
                            <div className="apartament-details-buttons">
                                <Button variant="primary" onClick={() => setIsEditing(!isEditing)}>
                                    <FontAwesomeIcon icon={isEditing ? faTimes : faEdit} style={{ marginRight: '8px' }} />
                                    {isEditing ? 'Отхвърляне' : 'Редактиране'}
                                </Button>

                                {isEditing && (
                                    <Button variant="primary" onClick={handleAddResident} disabled={numberOfResidents >= 6}>Добави обитател</Button>
                                )}

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
                                            Сигурни ли сте, че искате да изтриете апартамент номер {apartament.property_number}?
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleCancelDelete}>
                                                Затвори
                                            </Button>
                                            <Button variant="danger" onClick={deleteProperty}>
                                                Изтрий
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                )}
                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>
            {isEditing && (
                <Button variant="primary" onClick={handleSave}><FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />Запази промените</Button>
            )}
        </>
    );
};

export default ApartamentDetails;
