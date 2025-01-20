import { useEffect, useState } from "react";
import * as propertyService from '../../services/propertyService';

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
    pets: false,
    rent: '',
    phone_number: '',
    email: ''
} 

const CreateProperty = () => {

    const [formValues, setFormValues] = useState(formInitialState);
    const [residents, setResidents] = useState([]);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
    const [errors, setErrors] = useState({
        city: '', //add required fields
        address: ''
    });

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state, 
            [e.target.name]: e.target.value,
        }))
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const username = localStorage.getItem('username');
      
        const updatedFormValues = {
          ...formValues,
          created_by: username,
          residents
        };

        propertyService.createProperty(updatedFormValues)
          .then((data) => {
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

     // Handle changes for each resident's name and birthday
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
        
        // Update errors state
        setErrors(validationErrors);

        // Disable button if any field is empty
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
            <h3>Създаване на нов апартамент</h3>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='city'>Град <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='city' type='text' name="city" value={formValues.city} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.city ? 'is-invalid' : ''} />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='neighbourhood'>Квартал</label>
                </Form.Label>
                <Form.Control id='neighbourhood' type='text' name="neighbourhood" value={formValues.neighbourhood} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.neighbourhood} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='address'>Адрес <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='address' type='text' name="address" value={formValues.address} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.address ? 'is-invalid' : ''} />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}

            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='entranceId'>Вход <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='entranceId' type='text' name="entranceId" value={formValues.entranceId} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.entranceId} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='propertyNumber'>Номер на апартамент <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='propertyNumber' type='text' name="propertyNumber" value={formValues.propertyNumber} onChange={changeHandler} />
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
                <Form.Select name="pets" id="pets" onChange={changeHandler} value={formValues.pets}>
                    <option value={false}>Не</option>
                    <option value={true}>Да</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='rent'>Дава ли се под наем</label>
                </Form.Label>
                <Form.Control id='rent' type='text' name="rent" value={formValues.rent} onChange={changeHandler} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='phone'>Телефонен номер <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='phone' type='text' name="phone" value={formValues.phone} onChange={changeHandler} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='email'>Email <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='email' type='text' name="email" value={formValues.email} onChange={changeHandler} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='username'>Потребителско име <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='username' type='text' name="username" value={formValues.username} onChange={changeHandler} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='password'>Парола <span className="required-field">*</span></label>
                </Form.Label>
                <Form.Control id='password' type='text' name="password" value={formValues.password} onChange={changeHandler} />
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

                <Button type="button" onClick={addResident} disabled={residents.length >= 6}>
                    Добави живущ
                </Button>
            
            {
                errors.entranceId && (
                    <p className="errorMessage">{errors.entranceId}</p>
                )

                // errors.username && (
                //     <p className="errorMessage">{errors.username }</p>
                // ),
            }

            <div className="buttons">
              <Button type='button' variant="success" onClick={submitHandler} disabled={isSaveButtonDisabled}>Запази</Button>
              <Button type='button' variant="secondary">Откажи</Button>
            </div>
          </Form>
        </>
    )
}




export default CreateProperty;