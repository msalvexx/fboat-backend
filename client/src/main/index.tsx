import React from 'react'
import ReactDOM from 'react-dom'
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'

import { Router } from '@/presentation/components'

UIkit.use(Icons)

ReactDOM.render(
  <Router/>,
  document.getElementById('main')
)