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
 
} 

const CreateAddress = () => {
    const [formValues, setFormValues] = useState(formInitialState);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    const [errors, setErrors] = useState({
        city: '', //add required fields
        address: '',
        entranceId: '',
    });

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state, 
            [e.target.name]: e.target.value,
        }))
    }

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
        
        // Update errors state
        setErrors(validationErrors);

        // Disable button if any field is empty
        setIsSaveButtonDisabled(!isValid);
    }

        const submitHandler = (e) => {
            e.preventDefault();
            const username = localStorage.getItem('username');
          
            const updatedFormValues = {
              ...formValues,
              created_by: username              
            };

            console.log(updatedFormValues)
    
            addressService.createAddress(updatedFormValues)
                .then((data) => {
                    toast("Успешно създадохте нов адрес");
                })
                .catch((error) => {
                    console.error(error);
                    toast("Този адрес вече съществува");
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
                toastStyle={{ backgroundColor: "#72AA37", color: 'white' }}
            />
            <Form className="row">
                <h3>Създаване на нов адрес</h3>

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
                    <Form.Control id='entranceId' type='text' name="entranceId" value={formValues.entranceId} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.entranceId ? 'is-invalid' : ''} />
                    {errors.entranceId && <div className="invalid-feedback">{errors.entranceId}</div>}
                </Form.Group>

              <Button type='button' variant="success" onClick={submitHandler} disabled={isSaveButtonDisabled}>Запази</Button>

            </Form>
        </>
    )
}

export default CreateAddress;

