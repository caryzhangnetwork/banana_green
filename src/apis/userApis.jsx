import axios from 'axios';

const login = async (userInfo) => {
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

export default login;


