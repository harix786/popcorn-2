// import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Login from './containers/Login'
import configureStore from './store/configureStore'
import Root from './containers/Root'


const store = configureStore()
console.log("store")
console.log(store)
console.log(localStorage)

render(
  	<Root store={store} />,
  document.getElementById('root')
)
