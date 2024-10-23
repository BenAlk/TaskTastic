import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from "./Auth.module.css"
import logo from "../../assets/logo.jpg"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [errorFields, setErrorFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const { login, currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const isValidEmail = (email) => {
        // This regex pattern checks for a basic email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setErrorFields
        setIsLoading(true)

        const newErrorFields = [];

        if (!email) {
            newErrorFields.push('email');
        } else if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            newErrorFields.push('email');
            setErrorFields(newErrorFields);
            setIsLoading(false)
            return;
        }

        if (!password) newErrorFields.push('password');

        if (newErrorFields.length > 0) {
            setError("Please fill in all fields");
            setErrorFields(newErrorFields);
            setIsLoading(false)
            return;
        }

        try {
            const result = await login(email, password)
            if(result.success){
                setMessage('Login successful, Redirecting to dashboard ...')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'An unexpected error occurred during login')
        } finally {
            setIsLoading(false)
        }
    }

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
            <button type="submit" className="btn">{isLoading ? 'Logging in...' : 'Log In'}</button>
        </form>
        </div>
        <p className={styles['login-link']}>
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
        {message && <p className={styles['message']}>{message}</p>}
        </div>
    );
};

export default Login;
