import { createBrowserRouter } from 'react-router-dom'
import { ItemList } from '../components/ItemList/ItemList'
import { ItemDetail } from '../components/ItemDetail/ItemDetail'
import { UserMemo } from '../components/UserMemo/UserMemo'
import { Home } from '../pages/Home/Home'

export const router = createBrowserRouter([
  {
    path: '/',
    element:  '',
    children: [
      {
        path: '/home',
        element: <Home />,
        children: [
          {
            path: '/home/itemlist',
            element: <ItemList />,
          },
          {
            path: '/home/itemdetail/:isEdit',
            element: <ItemDetail />,
          },
          {
            path: '/home/usermemo',
            element: <UserMemo />,
          },
        ]
      },
      {
        path: '*',
        element: <div>404</div>,
      }
    ]
  }
])

export default router;