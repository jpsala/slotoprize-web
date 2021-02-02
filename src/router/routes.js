
import Index from 'src/pages/Index'
import Login from 'src/pages/Login'
import Game from 'src/pages/Game'
// import Menu from 'src/pages/Menu'
import Profile from 'src/pages/Profile'
import Winners from 'src/pages/Winners'
import Raffles from 'src/pages/Raffles'
import ForgotPassword from 'src/pages/ForgotPassword'

import Error404 from 'src/pages/Error404'
import MainLayout from 'src/layouts/MainLayout'
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Index },
      { path: '/login', component: Login },
      { path: '/Forgot-password', component: ForgotPassword },
      {
        path: 'game',
        component: Game,
        children: [
          // { path: '', component: Game },
          { path: 'profile', component: Profile },
          { path: 'winners', component: Winners },
          { path: 'raffles', component: Raffles }
        ]
      }
      // { path: 'winners', component: Winners },
      // {
      //   path: '/menu',
      //   component: Menu,
      //   children: [
      //     { path: '', component: Profile },
      //     { path: 'profile', component: Profile }
      //   ]
      // }
    ]
  },

  {
    path: '*',
    component: Error404
  }
]

export default routes
