
import Index from 'src/pages/Index'
import Login from 'src/pages/Login'
import Game from 'src/pages/Game'
import Game2 from 'src/pages/Game2'

import Error404 from 'src/pages/Error404'
import MainLayout from 'src/layouts/MainLayout'
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Index },
      { path: 'login', component: Login },
      { path: 'game', component: Game2 },
      { path: 'game2', component: Game }
    ]
  },

  {
    path: '*',
    component: Error404
  }
]

export default routes
