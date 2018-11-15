import {createStore} from 'redux'
import reducer from './reducer'
import * as actions from './actions'

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;

export {actions}