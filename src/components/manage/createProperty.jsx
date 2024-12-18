import { useEffect, useState } from "react";
import './manage.scss';

import Form from 'react-bootstrap/Form';

import axios from 'axios';
import { compileString } from "sass";

const FORM_KEYS = {
    entranceId: '',
    propertyNumber: '',
    floor: '',
    area: '',
    memberAmount: '',
    pets: 'no',
    rent: ''
};

const formInitialState = {
    entranceId: '',
    propertyNumber: '',
    floor: '',
    area: '',
    memberAmount: '',
    pets: false,
    rent: ''
    // [FORM_KEYS.entranceId]: '',
    // [FORM_KEYS.propertyNumber]: '',
    // [FORM_KEYS.floor]: '',
    // [FORM_KEYS.area]: '',
    // [FORM_KEYS.memberAmount]: '',
    // [FORM_KEYS.pets]: '',
    // [FORM_KEYS.rent]: ''
} 

const CreateProperty = () => {

    const [formValues, setFormValues] = useState(formInitialState);
    const [errors, setErrors] = useState({})

    const changeHandler = (e) => {
        setFormValues(state => ({
            ...state, 
            [e.target.name]: e.target.value,
        }))
    }

    const submitHandler = (e) => {
        console.log(formValues);

        e.preventDefault();
          axios.post('http://localhost:3001/createProperty', formValues)
            .then((data) => {
              console.log(data);
            })
    }

    const emptyFieldValidation = (e) => {
        if(e.target.value === '') {
            setErrors(state => ({
                ...state,
                entranceId: 'Моля въведете вход'
            }))
        } else {
            setErrors(state => ({
                ...state,
                entranceId: ''
            }))
        }
    }

    return (
        <>
          <Form className="row">
            <h3>Създаване на нов апартамент</h3>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='entranceId'>Вход</label>
                </Form.Label>
                <Form.Control id='entranceId' type='text' name="entranceId" value={formValues.entranceId} onChange={changeHandler} onBlur={emptyFieldValidation} className={errors.entranceId} />
            </Form.Group>
            <Form.Group className="col-lg-6">
                <Form.Label>
                    <label htmlFor='propertyNumber'>Номер на апартамент</label>
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
            
            {
                errors.entranceId && (
                    <p className="errorMessage">{errors.entranceId}</p>
                )
            }

            <div>
              <button type='button'>Cancel</button>
              <button type='button' onClick={submitHandler} disabled={Object.values(errors).some(x => x)}>Submit</button>
            </div>
          </Form>
        </>
    )
}




export default CreateProperty;