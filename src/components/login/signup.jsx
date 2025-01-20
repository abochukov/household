import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';


function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState({
    username: '', //add required fields
    password: '',
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
  });

  // toast.configure();

  const emptyFieldValidation = () => {
    let validationErrors = {};
    let isValid = true;

    if (!username) {
      validationErrors.username = 'Моля, въведете потребителско име';
      isValid = false;
    }
    if (!email) {
      validationErrors.email = 'Моля, въведете email';
      isValid = false;
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      validationErrors.email = 'Моля, въведете валиден email';
      isValid = false;
    }
    if (!password) {
      validationErrors.password = 'Моля, въведете парола';
      isValid = false;
    } else if (password.length < 6) {
      validationErrors.password = 'Паролата трябва да е поне 6 знака';
      isValid = false;
    }
    if (!firstname) {
      validationErrors.firstname = 'Моля, въведете име';
      isValid = false;
    }
    if (!lastname) {
      validationErrors.lastname = 'Моля, въведете фамилия';
      isValid = false;
    }
    if (!phone) {
      validationErrors.phone = 'Моля, въведете телефон';
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(phone)) {  // Simple phone validation
      validationErrors.phone = 'Моля, въведете валиден телефонен номер';
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    if (!emptyFieldValidation()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/signup', {
        username,
        password,
        email,
        firstname,
        lastname,
        phone,
      });

      toast.success('Успешна регистрация!');

    } catch (err) {
      if (err.response) {
        // Show error toast
        const message = err.response.data.message;
        toast.error(message)
      } else {
        toast.error('Unexpected error, please try again!');
      }
    }
  };
  

  return (
    // <>
      <div className='signup-wrapper'>
      <div className='signup-container'>
        <h2>Форма за регистрация</h2>
        <div className='form-container'>
          <form onSubmit={handleSignup}>
            <div className='username'>
              <label>Потребителско име:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                onBlur={emptyFieldValidation} 
                className={errors.username ? 'is-invalid' : ''}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>
            <div className='password'>
              <label>Парола:</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onBlur={emptyFieldValidation} 
                className={errors.password ? 'is-invalid' : ''} 
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}

            </div>
            <div className='email'>
              <label>Email:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                onBlur={emptyFieldValidation} 
                className={errors.email ? 'is-invalid' : ''} 
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}

            </div>
            <div className='firstname'>
              <label>Име:</label>
              <input 
                type="firstname" 
                value={firstname} 
                onChange={(e) => setFirstname(e.target.value)}
                onBlur={emptyFieldValidation} 
                className={errors.firstname ? 'is-invalid' : ''}
              />
              {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}

            </div>
            <div className='lastname'>
              <label>Фамилия:</label>
              <input 
                type="lastname" 
                value={lastname} 
                onChange={(e) => setLastname(e.target.value)}
                onBlur={emptyFieldValidation} 
                className={errors.lastname ? 'is-invalid' : ''}
              />
              {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}

            </div>
            <div className='phone'>
              <label>Телефон:</label>
              <input 
                type="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                onBlur={emptyFieldValidation} 
                className={errors.phone ? 'is-invalid' : ''}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}

            </div>
            <i>Моля, попълнете всички полета</i>
            <button className='registrationBtn' type="submit">Регистрация</button>
          </form>

        </div>
      </div>
      <ToastContainer style={{zIndex: 99999}} />

    </div>
    // </>
  );
}

export default Signup;
