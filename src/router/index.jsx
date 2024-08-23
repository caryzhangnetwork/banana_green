import { createBrowserRouter, Navigate, Route } from 'react-router-dom'
import { ItemList } from '../components/ItemList/ItemList'
import { ItemDetail } from '../components/ItemDetail/ItemDetail'
import { UserMemo } from '../components/UserMemo/UserMemo'
import { Calendar } from '../components/Calendar/Calendar'
import { Home } from '../pages/Home/Home'
import { Login } from '../pages/Login/Login'

const checkUserLoginStatus = () => {
  const user = localStorage.getItem('user');
  if (user !== undefined && JSON.parse(user)) {
    return true;
  } else {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  // development
  return children;

  // production
  if (checkUserLoginStatus()) {
    return children;
  } else {
    return <Navigate to="/login" />
  }
};


export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '/home/itemlist',
        element: (
          <ProtectedRoute>
            <ItemList />
          </ProtectedRoute>
            
        ),
      },
      {
        path: '/home/usermemo',
        element: (
          <ProtectedRoute>
            <UserMemo />
          </ProtectedRoute>
            
        ),
      },
      {
        path: '/home/itemdetail/:id',
        element: (
          <ProtectedRoute>
            <ItemDetail />
          </ProtectedRoute>
            
        ),
      },
      {
        path: '/home/calendar',
        element: (
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
            
        ),
      }
    ]
  },
  {
    path: '*',
    element: <div>404</div>,
  }
], { basename: "/baba_green" })

export default router;