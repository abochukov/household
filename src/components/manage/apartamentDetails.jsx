import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as propertyService from '../../services/propertyService';
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
    }); // Default values

    const [isEditing, setIsEditing] = useState(false); // Toggle between view/edit mode
    const [loading, setLoading] = useState(true); // Track loading state
    const [formData, setFormData] = useState({
        city: '',
        address: '',
        floor: '',
        area: '',
        member_amount: '',
        pets: '',
        rent: '',
        username: ''
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
                    username: fetchedData.username ?? ''
                });

                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching apartment details", error);
                setLoading(false); // Ensure loading is false even on error
            });
    }, [id]);

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
                setApartament(data);
                setIsEditing(false); // Exit edit mode
            })
            .catch((error) => {
                console.error("Error saving apartment details", error);
            });
    };

    const deleteProperty = () => {
        propertyService.deleteProperty(id)
            .then((response) => {
                console.log("Property deleted successfully:", response);
                // Update the list by filtering out the deleted item
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
            <table>
                <thead>
                    <tr>
                        <th>апартамент {apartament.property_number}</th>
                        <th>
                            <button onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel' : 'Редактиране'}
                            </button>
                            <button onClick={() => deleteProperty(apartament.property_id)}>
                                Изтрий
                            </button>
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
                </tbody>
            </table>

            {isEditing && (
                <button onClick={handleSave}>Save</button>
            )}
        </>
    );
};

export default ApartamentDetails;
