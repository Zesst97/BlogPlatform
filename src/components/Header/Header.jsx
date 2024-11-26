/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import avatar from '../../assets/images/avatar.png'
import { logout } from '../../redux/auth/auth.slice'
import { ARTICLES, SIGN_UP, SIGN_IN, PROFILE, NEW_ARTICLE } from '../../utils/routes/routesPath'

import classes from './Header.module.scss'

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loginStatus = useSelector((state) => state.auth.isLoggedIn)
  const user = useSelector((state) => state.auth.user)

  const handleLogOut = () => {
    localStorage.removeItem('token')
    dispatch(logout())
    navigate(ARTICLES)
  }

  const HeaderIsUnLogged = (
    <div className={classes.header__authLinks}>
      <Link to={SIGN_IN} className={classes.header__signIn}>
        Sign In
      </Link>
      <Link to={SIGN_UP} className={classes.header__signUp}>
        Sign Up
      </Link>
    </div>
  )

  const HeaderIsLogged = (
    <div className={classes.header__user_navigation}>
      <Link to={NEW_ARTICLE} className={classes.header__create}>
        Create article
      </Link>
      <Link to={PROFILE}>
        <div className={classes.header__user_name}>{user && user.username}</div>
      </Link>
      <Link to={PROFILE}>
        <img className={classes.header__avatar} src={user?.image ? user.image : avatar} alt="Avatar" />
      </Link>
      <button type="button" className={classes.header__Log_out} onClick={() => dispatch(handleLogOut)}>
        Log Out
      </button>
    </div>
  )

  return (
    <header className={classes.header}>
      <Link to={ARTICLES} className={classes.header__logo}>
        Realworld Blog
      </Link>
      {loginStatus ? HeaderIsLogged : HeaderIsUnLogged}
    </header>
  )
}

export default Header
