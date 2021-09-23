import { Header } from "./Header";
import { InfoToolTip } from "./InfoToolTip";
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { register } from "../utils/apiAuth";

export function Register(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //Стейты для infoToolTip
    const [isInfoToolOpen, setIsInfoToolOpen ] = useState(false);
    const [isRegistrationSuccessful, setIsRegistrationSuccessful] = useState(false)

    const history = useHistory();

    function resetForm () {
        setEmail('');
        setPassword('');
    };

    function handleSubmit(e) {
        e.preventDefault()
        register( { email, password })
            .then((res) => {
            if(res) {
            setIsInfoToolOpen(true)
            setIsRegistrationSuccessful(true)
            resetForm()
            }
            }) 
        .then(resetForm)
        .catch((err) => (console.log(err)))
    }

    function handleClose () {
        setIsInfoToolOpen(false)
        props.handleRegistration(isRegistrationSuccessful)
    }

    return (
    <>
    <div className="page">
        <Header headerButtonText="Войти" onClick={() => history.push('/sign-in')}/>
        <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-form__header">Регистрация</h2>
        <input 
        className="auth-form__input" 
        id="authEmail" 
        placeholder="Email" 
        type="email"
        value={email||""}
        name="userEmail"
        onChange={e => setEmail(e.target.value)}
        required />
        <input 
        className="auth-form__input" 
        id="authPassword" 
        placeholder="Пароль" 
        type="password" 
        name="userPassword"
        value={password||""}
        onChange={e => setPassword(e.target.value)}
        required />
        <button className="auth-form__button" type="submit">Зарегистрироваться</button>
        <Link className="auth-form__link transition" to="/sign-in">Уже зарегистрированы? Войти</Link>
        </form>
        <InfoToolTip 
        isOpen={isInfoToolOpen} 
        isRegistrationSuccessful={isRegistrationSuccessful}
        onClose={handleClose} 
        />
    </div>
    </>
    )
    }
