//import './App.css';
import React from 'react';
import {api} from '../utils/api'
import { Header } from "./Header";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { ImagePopup } from "./ImagePopup";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';

export function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({name: '', link: ''})
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <>
        <div className="page"> 
        <Header />
        <Main 
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
    </CurrentUserContext.Provider>
  );
}

export default App