import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from "./Auth.module.css"
import logo from "../../assets/logo.jpg"

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const isValidEmail = (email) => {
        // This regex pattern checks for a basic email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setErrorFields([])

    const newErrorFields = [];

    if (!email) {
        newErrorFields.push('email');
    } else if (!isValidEmail(email)) {
        setError("Please enter a valid email address");
        newErrorFields.push('email');
        setErrorFields(newErrorFields);
        return;
    }

    if (!password) newErrorFields.push('password');
    if (!confirmPassword) newErrorFields.push('confirm-password');

    if (newErrorFields.length > 0) {
        setError("Please fill in all fields");
        setErrorFields(newErrorFields);
        return;
    }

    if (password !== confirmPassword) {
        setError("Passwords don't match");
        setErrorFields(['confirm-password', 'password'])
    return;
    }

    try {
        const result = await signup(email, password);
        if(result.success) {
            setMessage('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.error);
        }
    } catch (err) {
        console.error('Signup error:', err);
        setError(err.message || 'An unexpected error occurred during signup');
    }
};

return (
    <div className={styles['main-container']}>
        <div className={styles['logo-container']}>
            <div className={styles['tasktastic-logo']}>
                <img src={logo} alt="TaskTastic Logo" />
            </div>
        <h1 className={styles['tasktastic-title']}>TaskTastic</h1>
        </div>
        <div className={styles['auth-container']}>
            <p className={`${styles.error} ${error ? '' : styles['hidden']}`}>{error}</p>
            <form onSubmit={handleSubmit} noValidate className={styles['form-container']}>
                <div className={styles['form-group']}>
                    <input
                        type="email"
                        id="email"
                        className={`${styles['email']} ${errorFields.includes('email') ? styles['input-error'] : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className={styles['email-label']} htmlFor="email">Email</label>
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="password"
                        id="password"
                        className={`${styles['password']} ${errorFields.includes('password') ? styles['input-error'] : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label className={styles['password-label']} htmlFor="password">Password</label>
                </div>
                <div className={styles['form-group']}>
                    <input
                        type="password"
                        id="confirm-password"
                        className={`${styles['confirm-password']} ${errorFields.includes('confirm-password') ? styles['input-error'] : ''}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label className={styles['confirm-password-label']} htmlFor="confirm-password">Confirm Password</label>
                </div>
                <button type="submit" className="btn">Sign Up</button>
            </form>
        </div>
    <p className={styles['login-link']}>
        Already have an account? <Link to="/login">Log In</Link>
    </p>
    {message && <p className={styles['message']}>{message}</p>}
    </div>
);
};

export default Signup;
