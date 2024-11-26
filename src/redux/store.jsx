import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { api } from '../api/api'

import authReducer from './auth/auth.slice'

const reducers = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
})

const store = configureStore({
  reducer: reducers,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

export default store
