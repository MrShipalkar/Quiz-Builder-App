import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import API_URL from '../../services/config'

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState({
    emailError: '',
    passwordError: ''
  });

  const validateFormData = () => {
    const err = {
      emailError: '',
      passwordError: ''
    };

    let isValid = true;

    if (!formData.email) {
      err.emailError = "Invalid Email";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.emailError = "Enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      err.passwordError = "Enter Password";
      isValid = false;
    } else if ((formData.password).length < 6) {
      err.passwordError = "Password must contain min. 6 characters";
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
     
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
  
      const token = response.data.token;
      localStorage.setItem('token', token);
      toast.success('Logged in successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
  
    } catch (error) {
      console.error('Error response:', error.response);
  
      if (error.response && error.response.status === 400) {
        toast.error('Incorrect email or password!');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  return (
    <div>
      <form className='form-container' onSubmit={handleSubmit}>
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
        <button className='submit-btn' type='submit'>Log In</button>
      </form>
    </div>
  );
}

export default Login;
