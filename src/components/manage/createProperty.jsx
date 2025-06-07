import React, { useEffect, useState } from "react";
import * as propertyService from '../../services/propertyService';
import * as addressService from '../../services/addressService';

import Button from 'react-bootstrap/Button';
import './manage.scss';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';


const formInitialState = {
    city: '',
    address: '',
    entranceId: '',
    propertyNumber: '',
    floor: '',
    area: '',
    memberAmount: '',
    pets: 'false',
    rent: 'false',
    phone_number: '',
    email: ''
} 

const CreateProperty = () => {

    const [formValues, setFormValues] = useState(formInitialState);
    const [residents, setResidents] = useState([]);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [errors, setErrors] = useState({
        city: '',
        address: '',
        entranceId: '',
        propertyNumber: '',
        phone: '',
        email: '',
        username: '',
        password: ''
    });

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
    }, [])

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

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state, 
            [e.target.name]: e.target.value,
        }));
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const username = localStorage.getItem('username');
    
        const updatedFormValues = {
            ...formValues,
            pets: formValues.pets === 'true',
            rent: formValues.rent === 'true',
            created_by: username,
            residents
        };
    
        propertyService.createProperty(updatedFormValues)
            .then(() => {
                toast("Успешно създадохте нов обект");
            })
            .catch((error) => {
                console.error(error);
                toast("Грешка при създаването на обект");
            });
    };
   

    const addResident = () => {
        if (residents.length < 6) {
            setResidents([...residents, { name: "", birthday: "" }]);
        }
    };

     const handleResidentChange = (index, field, value) => {
        const updatedResidents = [...residents];
        updatedResidents[index][field] = value;
        setResidents(updatedResidents);
    };

    const emptyFieldValidation = (e) => {
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

        if (!formValues.propertyNumber) {
            validationErrors.propertyNumber = 'Моля, въведете номер на апартамент';
            isValid = false;
        } else {
            validationErrors.propertyNumber = '';
        }

        if (!formValues.phone) {
            validationErrors.phone = 'Моля, въведете телефонен номер';
            isValid = false;
        } else {
            validationErrors.phone = '';
        }

        if (!formValues.email) {
            validationErrors.email = 'Моля, въведете email';
            isValid = false;
        } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formValues.email)) {
            validationErrors.email = 'Моля, въведете валиден email';
            isValid = false;
        } else {
            validationErrors.email = '';
        }

        if (!formValues.username) {
            validationErrors.username = 'Моля, въведете потребителско име';
            isValid = false;
        } else {
            validationErrors.username = '';
        }

        if (!formValues.password) {
            validationErrors.password = 'Моля, въведете парола';
            isValid = false;
        } else {
            validationErrors.password = '';
        }
        
        setErrors(validationErrors);

        setIsSaveButtonDisabled(!isValid);
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
                toastStyle={{ backgroundColor: "#72AA37", color: 'white' }}
            />
          <Form className="row">
            <div className="title">Създаване на нов обект</div>
            <div className="info">След като създадете обект в секция "управление" имате възможност да редактирате записа.</div>

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

            <Form.Group className="col-lg-6">
                    <Form.Label htmlFor='city'>Град <span className="required-field">*</span></Form.Label>
                    <Form.Control
                        id='city'
                        type='text'
                        name="city"
                        value={formValues.city}
                        onChange={changeHandler}
                        onBlur={emptyFieldValidation}
                        disabled
                    />
                </Form.Group>
                <Form.Group className="col-lg-6">
                    <Form.Label htmlFor='neighbourhood'>Квартал</Form.Label>
                    <Form.Control
                        id='neighbourhood'
                        type='text'
                        name="neighbourhood"
                        value={formValues.neighbourhood}
                        onChange={changeHandler}
                        disabled
                    />
                </Form.Group>
                <Form.Group className="col-lg-6">
                    <Form.Label htmlFor='address'>Адрес <span className="required-field">*</span></Form.Label>
                    <Form.Control
                        id='address'
                        type='text'
                        name="address"
                        value={formValues.address}
                        onChange={changeHandler}
                        onBlur={emptyFieldValidation}
                        disabled
                    />
                </Form.Group>
                <Form.Group className="col-lg-6">
                    <Form.Label htmlFor='entranceId'>Вход <span className="required-field">*</span></Form.Label>
                    <Form.Control
                        id='entranceId'
                        type='text'
                        name="entranceId"
                        value={formValues.entranceId}
                        onChange={changeHandler}
                        onBlur={emptyFieldValidation}
                        disabled
                    />
                </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='propertyNumber'>Номер на апартамент <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='propertyNumber' type='text' name="propertyNumber" value={formValues.propertyNumber} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.propertyNumber ? 'is-invalid' : ''} />
                {errors.propertyNumber && <div className="invalid-feedback">{errors.propertyNumber}</div>}
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='floor'>Етаж</label>
                </Form.Label>
                <Form.Control id='floor' type='text' name="floor" value={formValues.floor} onChange={changeHandler} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='area'>Квадратура</label>
                </Form.Label>
                <Form.Control id='area' type='text' name="area" value={formValues.area} onChange={changeHandler} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='memberAmount'>Брой живущи</label>
                </Form.Label>
                <Form.Control id='memberAmount' type='text' name="memberAmount" value={formValues.memberAmount} onChange={changeHandler} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='pets'>Домашни любимци</label>
                </Form.Label>
                <Form.Select 
                    name="pets" 
                    id="pets" 
                    onChange={changeHandler} 
                    value={formValues.pets}
                >
                    <option value="false">Не</option>
                    <option value="true">Да</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='rent'>Дава ли се под наем</label>
                </Form.Label>
                <Form.Select 
                    name="rent" 
                    id="rent" 
                    onChange={changeHandler} 
                    value={formValues.rent}
                >
                    <option value="false">Не</option>  
                    <option value="true">Да</option>  
                </Form.Select>
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='phone'>Телефонен номер <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='phone' type='text' name="phone" value={formValues.phone} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.phone ? 'is-invalid' : ''} />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='email'>Email <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='email' type='text' name="email" value={formValues.email} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.email ? 'is-invalid' : ''} />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='username'>Потребителско име <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='username' type='text' name="username" value={formValues.username} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.username ? 'is-invalid' : ''} />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='password'>Парола <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='password' type='text' name="password" value={formValues.password} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.password ? 'is-invalid' : ''} />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </Form.Group>

            <div className="residentals-form">
                {residents.map((resident, index) => (
                    <div key={index} className="col-lg-4">
                        <Form.Label>Живущ {index + 1}</Form.Label>
                        <Form.Control
                            type="text"
                            name={`residentName${index}`}
                            value={resident.name}
                            onChange={(e) =>
                                handleResidentChange(index, "name", e.target.value)
                            }
                            placeholder="Име"
                        />
                        <Form.Control
                            type="date"
                            name={`residentBirthday${index}`}
                            value={resident.birthday}
                            onChange={(e) =>
                                handleResidentChange(index, "birthday", e.target.value)
                            }
                            placeholder="Рожденна дата"
                            style={{marginTop: '10px'}}
                        />
                    </div>
                ))}

            </div>

                <Button className="custom-btn" onClick={addResident} disabled={residents.length >= 6} style={{width: '200px'}}>
                    Добави живущ
                </Button>
            
            <div className="buttons">
              <Button type='button' onClick={submitHandler} disabled={isSaveButtonDisabled} style={{background: '#12b349', color: '#fff', border: 'none'}}>Запази</Button>
            </div>
          </Form>
        </>
    )
}




export default CreateProperty;