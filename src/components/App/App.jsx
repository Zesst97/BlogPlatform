import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Header from '../Header'
import PostList from '../PostList'
import PostDetails from '../PostDetails'
import SignUp from '../SignUp'
import SignIn from '../SignIn'
import EditProfile from '../EditProfile'
import CreateArticle from '../CreateArticle'
import EditArticle from '../EditArticle'
import RequireAuth from '../../utils/hoc/RequireAuth'
import {
  HOME,
  ARTICLES,
  ARTICLE_DETAILS,
  ARTICLE_EDIT,
  SIGN_UP,
  SIGN_IN,
  PROFILE,
  NEW_ARTICLE,
} from '../../utils/routes/routesPath'
import { useGetCurrentUserQuery } from '../../api/api'
import { setUser } from '../../redux/auth/auth.slice'

import classes from './App.module.scss'

function App() {
  const localToken = localStorage.getItem('token')
  const { data, isSuccess } = useGetCurrentUserQuery(localToken, {
    skip: !localToken,
  })

  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.user))
    }
  }, [localToken, isSuccess, data, dispatch])

  return (
    <main className={classes.main}>
      <Header />
      <Routes>
        <Route path={HOME} element={<Navigate to={ARTICLES} />} />
        <Route path={ARTICLES} element={<PostList />} />
        <Route path={ARTICLE_DETAILS} element={<PostDetails />} />
        <Route
          path={ARTICLE_EDIT}
          element={
            <RequireAuth>
              <EditArticle />
            </RequireAuth>
          }
        />
        <Route path={SIGN_UP} element={<SignUp />} />
        <Route path={SIGN_IN} element={<SignIn />} />
        <Route
          path={PROFILE}
          element={
            <RequireAuth>
              <EditProfile />
            </RequireAuth>
          }
        />
        <Route
          path={NEW_ARTICLE}
          element={
            <RequireAuth>
              <CreateArticle />
            </RequireAuth>
          }
        />
      </Routes>
    </main>
  )
}

export default App
