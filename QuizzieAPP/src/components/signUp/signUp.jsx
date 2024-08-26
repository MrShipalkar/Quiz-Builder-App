import React, { useState } from 'react';
import './signUp.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function SignUp() { 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState({
    nameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: ''
  });

  const validateFormData = () => {
    const err = {
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: ''
    };

    let isValid = true;

    if (!formData.name) {
      err.nameError = "Invalid name";
      isValid = false;
    } else if ((formData.name).length < 3) {
      err.nameError = "Name must contain min. 3 characters";
      isValid = false;
    }

    if (!formData.email) {
      err.emailError = "Invalid Email";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.emailError = "Enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      err.passwordError = "Weak password";
      isValid = false;
    } else if ((formData.password).length < 6) {
      err.passwordError = "Password must contain min. 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      err.confirmPasswordError = "password doesn't match";
      isValid = false;
    } else if ((formData.confirmPassword).length < 6) {
      err.confirmPasswordError = "Password must contain min. 6 characters";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      err.confirmPasswordError = "Password and confirm password are not matching";
      isValid = false;
    }

    setError(err); 

    return isValid;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateFormData();

    if (!isValid) return; 

    try {
        const response = await axios.post('http://localhost:3001/api/auth/register', formData);

    
        toast.success('User registered successfully!');
        setTimeout(() => {
          navigate('/dashboard');
      }, 2000); 

    } catch (error) {
      
        if (error.response && error.response.status === 409) { 
            toast.error('User already exists!');
        } else {
            toast.error('An unexpected error occurred. Please try again.');
        }
    }
  };

  return (
    <div>
      <form className='form-container' onSubmit={handleSubmit}>
        <div className='form-components'>
          <label>Name</label>
          <input
            className={`form-input ${error.nameError ? 'error' : ''}`}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={error.nameError || ''} 
          />
        </div>
        <div className='form-components'>
          <label>Email</label>
          <input
            className={`form-input ${error.emailError ? 'error' : ''}`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={error.emailError || ''} 
          />
        </div>
        <div className='form-components'>
          <label>Password</label>
          <input
            className={`form-input ${error.passwordError ? 'error' : ''}`}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={error.passwordError || ''} 
          />
        </div>
        <div className='form-components'>
          <label>Confirm Password</label>
          <input
            className={`form-input ${error.confirmPasswordError ? 'error' : ''}`}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={error.confirmPasswordError || ''} 
          />
        </div>
        <button className='submit-btn' type='submit'>Sign-Up</button>
      </form>
    </div>
  );
}

export default SignUp;
