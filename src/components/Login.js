import { Header } from "./Header"
import React, { useState } from 'react';
import { login } from "../utils/apiAuth";
import { useHistory } from 'react-router-dom';

export function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

   function resetForm () {
        setEmail('');
        setPassword('');
    };

    const history = useHistory();

    function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password){
        return;
      }
    login(password, email)
      .then((data) => { 
        if (!data) throw new Error('Неправильные имя пользователя или пароль');
        if (data.token) {
        setCurrentEmail(email)
        props.handleLogin(data.token)
        }
        })
        .then(resetForm)
        .catch((err) => (console.log(err)))// запускается, если пользователь не найден
    }
      //Функция передачи емейлв в APP
    function setCurrentEmail(email) {
      props.setUserEmail(email)
    }

    return (
    <>
    <div className="page">
        <Header headerButtonText="Регистрация" onClick={() => history.push('/sign-up')}/>
        <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-form__header">Вход</h2>
        <input 
        className="auth-form__input" 
        id="edit-form__authEmail" 
        placeholder="Email" 
        type="email"
        value={email||""}
        name="userEmail"
        onChange={e => setEmail(e.target.value)}
        required />
        <input 
        className="auth-form__input" 
        id="edit-form__authPassword" 
        placeholder="Пароль" 
        type="password" 
        name="userPassword"
        value={password||""}
        onChange={e => setPassword(e.target.value)}
        required />
        <button className="auth-form__button" type="submit">Войти</button>
        </form>
    </div>
    </>
    )
}