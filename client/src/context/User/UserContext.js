import { useState, createContext, useEffect } from 'react';

export const UserContext = createContext();

export const UserStatus = (props) => {
  const { checkAuth } = require('../../utils/checkAuth');
  const { getUser } = require('../../data/fetchingData');
  const [user, setUser] = useState({
    status: {
      isLoggedIn: localStorage.getItem('token') ? true : false,
      user_id: localStorage.getItem('user_id'),
      token: localStorage.getItem('token'),
    },
    data: {
      name: '',
      email: '',
      address: '',
      number: '',
      role: {
        position: '',
        company: '',
      },
    },
  });

  useEffect(() => {
    const response = checkAuth(user.status.token);
    response.then((isLoggedIn) => {
      setUser({ ...user, status: { ...user.status, isLoggedIn } });
    });
    if (user.status.isLoggedIn) {
      const data = getUser(user.status.user_id, user.status.token);
      data.then((res) => {
        setUser({ ...user, data: res });
      });
    }
  }, [user.status.isLoggedIn]);

  return (
    <UserContext.Provider
      value={{
        userData: [user, setUser],
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
