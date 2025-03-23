import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // In a real app, this would make an API call to request a password reset
    console.log('Password reset requested for:', email);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="forgot-password-page">
      <h2>Reset Your Password</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {submitted ? (
        <div className="success-message">
          <p>If an account exists with {email}, we've sent instructions to reset your password.</p>
          <p>
            <Link to="/login">Return to Login</Link>
          </p>
        </div>
      ) : (
        <>
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </button>
          </form>
        </>
      )}
      
      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
        <span> | </span>
        <Link to="/register">Create an Account</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 