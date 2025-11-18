import React, { useState, useEffect } from 'react';
import './Login.css';

import Logo from '../assets/images/logoFID.png';
import authIllustration from '../assets/images/img8.svg';

const Login = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUpClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSignUpMode(true);
    };

    const handleSignInClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSignUpMode(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsLoading(false);
        // Ici vous ajouterez votre logique d'authentification
    };

    useEffect(() => {
        const container = document.querySelector(".auth-container");
        if (container) {
            if (isSignUpMode) {
                container.classList.add("sign-up-mode");
            } else {
                container.classList.remove("sign-up-mode");
            }
        }
    }, [isSignUpMode]);

    return (
        <div className={`auth-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
            {/* Background Elements */}
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>

            <div className="auth-wrapper">
                {/* Forms Section */}
                <div className="forms-section">
                    <div className="forms-wrapper">
                        {/* Sign In Form */}
                        <form 
                            method="POST" 
                            onSubmit={handleSubmit}
                            className={`auth-form sign-in-form ${isSignUpMode ? 'hidden' : 'active'}`}
                        >
                            <div className="form-header">
                                <img src={Logo} alt="FID Logo" className="auth-logo" />
                                <h2 className="form-title">Content de vous revoir</h2>
                                <p className="form-subtitle">Connectez-vous à votre compte</p>
                            </div>

                            <div className="form-content">
                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <i className="fas fa-envelope input-icon"></i>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Adresse e-mail"
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <i className="fas fa-lock input-icon"></i>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            placeholder="Mot de passe"
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-options">
                                    <label className="remember-me">
                                        <input type="checkbox" />
                                        Se souvenir de moi
                                    </label>
                                    <a href="#" className="forgot-password">Mot de passe oublié ?</a>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`auth-btn primary ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="btn-loader"></div>
                                    ) : (
                                        'Se connecter'
                                    )}
                                </button>

                                <div className="divider">
                                    <span>Ou continuer avec</span>
                                </div>

                                <div className="social-auth">
                                    <button type="button" className="social-btn google">
                                        <i className="fab fa-google"></i>
                                        Google
                                    </button>
                                    <button type="button" className="social-btn microsoft">
                                        <i className="fab fa-microsoft"></i>
                                        Microsoft
                                    </button>
                                </div>
                            </div>

                            <div className="form-footer">
                                <p>Nouveau sur la plateforme ? 
                                    <button 
                                        type="button" 
                                        className="switch-form-btn"
                                        onClick={handleSignUpClick}
                                    >
                                        Créer un compte
                                    </button>
                                </p>
                            </div>
                        </form>

                        {/* Sign Up Form */}
                        <form 
                            onSubmit={handleSubmit}
                            className={`auth-form sign-up-form ${isSignUpMode ? 'active' : 'hidden'}`}
                        >
                            <div className="form-header">
                                <img src={Logo} alt="FID Logo" className="auth-logo" />
                                <h2 className="form-title">Commencez l'aventure</h2>
                                <p className="form-subtitle">Créez votre compte en quelques secondes</p>
                            </div>

                            <div className="form-content">
                                <div className="name-fields">
                                    <div className="input-group">
                                        <div className="input-wrapper">
                                            <i className="fas fa-user input-icon"></i>
                                            <input 
                                                type="text" 
                                                name="firstName" 
                                                placeholder="Prénom"
                                                className="auth-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="input-wrapper">
                                            <i className="fas fa-user input-icon"></i>
                                            <input 
                                                type="text" 
                                                name="lastName" 
                                                placeholder="Nom"
                                                className="auth-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <i className="fas fa-envelope input-icon"></i>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Adresse e-mail"
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <i className="fas fa-lock input-icon"></i>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            placeholder="Mot de passe"
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-wrapper">
                                        <i className="fas fa-lock input-icon"></i>
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            placeholder="Confirmer le mot de passe"
                                            className="auth-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="terms-agreement">
                                    <label className="checkbox-label">
                                        <input type="checkbox" required />
                                        <span className="checkmark"></span> &nbsp;
                                        <p className='size'>J'accepte les <a href="#">conditions d'utilisation</a> et la <a href="#">politique de confidentialité</a></p>
                                    </label>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`auth-btn primary ${isLoading ? 'loading' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="btn-loader"></div>
                                    ) : (
                                        "S'inscrire"
                                    )}
                                </button>
                            </div>

                            <div className="form-footer">
                                <p>Déjà membre ? 
                                    <button 
                                        type="button" 
                                        className="switch-form-btn"
                                        onClick={handleSignInClick}
                                    >
                                        Se connecter
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                {isSignUpMode ? 'Inscrivez-vous' : 'Bienvenue à bord'}
                            </h1>
                            <p className="hero-description">
                                {isSignUpMode 
                                    ? 'Découvrez une plateforme innovante conçue pour répondre à tous vos besoins avec efficacité et simplicité.'
                                    : 'Accédez à votre espace personnel et profitez de toutes les fonctionnalités de notre plateforme.'
                                }
                            </p>
                        </div>
                        
                        <div className="hero-visual">
                            <img 
                                src={authIllustration} 
                                alt="Authentication Illustration" 
                                className="hero-image"
                            />
                        </div>

                        <button 
                            className="auth-btn outline switch-mode-btn"
                            onClick={isSignUpMode ? handleSignInClick : handleSignUpClick}
                        >
                            {isSignUpMode ? 'Se connecter' : "S'inscrire"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;