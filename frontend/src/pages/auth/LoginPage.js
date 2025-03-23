import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../../store/auth/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
    
    // Mock login - in a real app, you would dispatch a login action here
    dispatch(setCredentials({
      user: {
        id: '1',
        email: formData.email,
        name: 'Demo User',
      },
      token: 'mock-token-123'
    }));
    
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <h2>Log In to Your Account</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="auth-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <span> | </span>
        <Link to="/register">Create an Account</Link>
      </div>
    </div>
  );
};

export default LoginPage; 