import axios from 'axios';

export const login = async (userInfo) => {
  let loginSuccess = false;
  const data = {
    username: userInfo.username,
    pw: userInfo.pw,
  },
  res = await axios.post('/api/userLogin', data)
  if (res.data.status === 1) {
    if (res.data.user_id) {
      localStorage.setItem('user', JSON.stringify(res.data));
      loginSuccess = true;
    }
  }
  return loginSuccess;
}

export const updateUserProfile = async (data) => {
  const user = JSON.parse(localStorage.getItem('user')),

  req = {
    userId: user.user_id,
    quotes: data.quoteValue,
    reminder: data.reminderValue,
  };

  const res = await axios.post('/api/updateUserProfile', req)
  if (res.data.status === 1) {
    return true;
  } else {
    return false;
  }
}


export const getUserProfile = async () => {
  const user = JSON.parse(localStorage.getItem('user')),

  req = {
    userId: user.user_id,
  };

  const res = await axios.post('/api/getUserProfile', req)
  if (res.data.status === 1) {
    return res.data.result;
  }
  return '';
}




export default login;


