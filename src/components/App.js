//import './App.css';
import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import {api} from '../utils/api'
import { Header } from "./Header";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { ImagePopup } from "./ImagePopup";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { Login } from './Login';
import { Register } from './Register';
import { ProtectedRoute } from './ProtectedRoute';
import { checkTokenValidity } from '../utils/apiAuth';

export function App() {
    const history = useHistory();
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({name: '', link: ''})
    //стейт емейла юзера
    const [userEmail, setUserEmail] = React.useState('email@mail.com');
    //стейт авторизации юзера
    const [loggedIn, setIsLoggedIn] = React.useState(false);
    //задания стейта юзера при монтировании
    const [currentUser, setCurrentUser] = React.useState([]);
    React.useEffect(() => {
        api.getUserData()
        .then((res)=> {
            setCurrentUser(res)
        })
        .catch(err => console.log(err));
      }, 
      []);

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false)
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setSelectedCard({name: '', link: ''})
    }
    //обновление инфо о пользователе
    function handleUpdateUser(data) {
        api.updateUserData(data)
        .then((res)=> {
            setCurrentUser(res)
            closeAllPopups()
        })
        .catch(err => console.log(err));
    }
    //Изменение аватара
    function handleUpdateAvatar(data) {
        api.updateAvatar(data.avatar)
        .then((res) => {
            setCurrentUser(res)
            closeAllPopups()
        })
        .catch(err => console.log(err));
    }
    //Карточки
    const [cards, renderCards] = React.useState([]);

    React.useEffect(() => {
    api.getInitialCards()
        .then((res)=> {
            renderCards(res)
        })
        .catch(err => console.log(err));
    }, []);
    //Функция лайков 
    function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
        renderCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    });
    }
    //Удаление карточки
    function handleCardDelete(card) {
        api.deleteCard(card._id)
        .then(() => {
        renderCards((state) => state.filter((c) => c._id !== card._id))
        });
    }
    //Добавление карточки
    function handleAddPlaceSubmit(data) {
        api.addCard(data)
        .then((newCard)=>{
        renderCards([newCard, ...cards]);
        closeAllPopups() 
        })
        .catch(err => console.log(err));
    }

    //Проверка токена при загрузке страницы 
    React.useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            checkTokenValidity(jwt)
            .then((res) => {
                if(res) {
                    setIsLoggedIn(true)
                    setUserEmail(res.data.email)
                }
            }) 
        }
      }, []);
    //Переадресация на главную страницу, если пользователь уже залогинен
   
    React.useEffect(() => {
        if (loggedIn) history.push('/');
      }, [loggedIn]);

     //Логин
    function handleLogin(token){
        setIsLoggedIn(true);
        localStorage.setItem('jwt', token);
    } 
    //Логаут
    function handleLogout() {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
    }
    //Регистрация
    function onRegister(registeredUser) {
    if(registeredUser) {
        history.push('/sign-in')
        }
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
        {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        <Switch>
            <Route exact path="/">
            <>
            <div className="page"> 
            <Header headerButtonText="Выйти" onClick={handleLogout}>
            <p>{userEmail}</p>
            </Header>
            <ProtectedRoute 
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick} 
            onAddPlace={handleAddPlaceClick} 
            onEditAvatar={handleEditAvatarClick} 
            onCardClick={setSelectedCard}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            />
            <Footer />
            </div>
            <section className="popups">
            <EditAvatarPopup 
            isOpen={isEditAvatarPopupOpen} 
            onClose={closeAllPopups} 
            onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
            isOpen={isAddPlacePopupOpen} 
            onClose={closeAllPopups} 
            onAddPlace={handleAddPlaceSubmit}
            />
            <EditProfilePopup 
            isOpen={isEditProfilePopupOpen} 
            onClose={closeAllPopups} 
            onUpdateUser={handleUpdateUser}
            />
            <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            />
            </section>
            </>
            </Route>
            <Route path="/sign-up">
                <Register 
                handleRegistration={onRegister}
                />
            </Route>
            <Route path="/sign-in">
                <Login 
                handleLogin={handleLogin}
                setUserEmail={setUserEmail}
                />
            </Route>
        </Switch>
    </CurrentUserContext.Provider>
  );
}

export default App

