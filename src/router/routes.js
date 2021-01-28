
import Index from 'src/pages/Index'
import Login from 'src/pages/Login'
import Game from 'src/pages/Game'
import Menu from 'src/pages/Menu'
import Profile from 'src/pages/Profile'
import Winners from 'src/pages/Winners'

import Error404 from 'src/pages/Error404'
import MainLayout from 'src/layouts/MainLayout'
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Index },
      { path: 'login', component: Login },
      {
        path: 'game',
        component: Game,
        children: [
          // { path: '', component: Game },
          { path: 'profile', component: Profile },
          { path: 'winners', component: Winners }
        ]
      },
      { path: 'winners', component: Winners },
      {
        path: '/menu',
        component: Menu,
        children: [
          { path: '', component: Profile },
          { path: 'profile', component: Profile }
        ]
      }
    ]
  },

  {
    path: '*',
    component: Error404
  }
]

export default routes
