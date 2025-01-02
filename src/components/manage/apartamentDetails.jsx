import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as propertyService from '../../services/propertyService';
import './manage.scss';

const ApartamentDetails = () => {
    const { id } = useParams();
    const [apartament, setApartament] = useState({});
    const [isEditing, setIsEditing] = useState(false); // To toggle between view/edit mode
    const navigate = useNavigate();

    // Initialize state for editable fields
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

    useEffect(() => {
        propertyService.singleProperty(id)
            .then((data) => {
                setApartament(data);
                setFormData({
                    city: data[0]?.city ?? '',
                    address: data[0]?.address ?? '',
                    floor: data[0]?.floor ?? '',
                    area: data[0]?.area ?? '',
                    member_amount: data[0]?.member_amount ?? '',
                    pets: data[0]?.pets ?? '',
                    rent: data[0]?.rent ?? '',
                    username: data[0]?.username ?? ''
                });
            })
            .catch((error) => {
                // Handle error (optional, e.g., toast message)
            });
    }, [id]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle the save functionality (send the data to the backend)
    const handleSave = () => {
        propertyService.updateProperty(id, formData)
            .then((data) => {
                setApartament(data);
                setIsEditing(false); // Exit edit mode
            })
            .catch((error) => {
                // Handle error (optional, e.g., toast message)
            });
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>апартамент {apartament[0]?.property_number}</th>
                        <th>
                            <button onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel' : 'Редактиране'}
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
                                apartament[0]?.city ?? 'няма данни'
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
                                apartament[0]?.address ?? 'няма данни'
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
                                apartament[0]?.floor ?? 'няма данни'
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
                                apartament[0]?.area ?? 'няма данни'
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
                                apartament[0]?.member_amount ?? 'няма данни'
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
                                apartament[0]?.pets ?? 'няма данни'
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
                                apartament[0]?.rent ?? 'няма данни'
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
                                apartament[0]?.username ?? 'няма данни'
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
