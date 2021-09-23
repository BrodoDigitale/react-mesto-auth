
  const BASE_URL = 'https://auth.nomoreparties.co';

  const register = ({password, email}) => {
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({password, email})
    })
    .then((response) => {
      try {
        if (response.status === 201){
          return response.json()
        } else if (response.status === 400) {
         console.log('некорректно заполнено одно из полей')
        }
      } catch(e){
        return (e)
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
  }; 
  
  const login = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({password, email})
    })
    .then((response => response.json()))
    .then((data) => {
      if (data.token){
        localStorage.setItem('jwt', data.token);
        return data;
      }
    })
    .catch(err => console.log(err))
  }; 

  const checkTokenValidity = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
      }).then((response) => {
        try {
          if (response.status === 200){
            return response.json();
          }
        } catch(e){
          return (e)
        }
      })
      .then((res) => {
        return res;
      })
      .catch((err) => console.log(err));
    }

export { BASE_URL,register, login, checkTokenValidity }