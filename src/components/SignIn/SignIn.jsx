/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ThreeDotsBounce } from 'react-svg-spinners'

import { setUser } from '../../redux/auth/auth.slice'
import { useLoginUserMutation } from '../../api/api'
import { SIGN_UP } from '../../utils/routes/routesPath'

import classes from './SignIn.module.scss'

export default function SignIn() {
  const [loginUser, { data, isSuccess, error, isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPage = location.state?.from?.pathname || '/articles'
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onchange',
  })

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('token', data.user.token)
      dispatch(setUser(data.user))
    }
    if (isLoggedIn || (isSuccess && data?.user)) {
      navigate(fromPage)
    }
  }, [isSuccess, navigate, isLoggedIn])

  const onSubmit = ({ email, password }) => {
    loginUser({ email, password })
    reset()
  }

  const errorMessage = (name) => {
    return errors?.[name] && <div className={classes.signin_form__message}>{errors[name].message}</div>
  }

  const serverErrorMessage = error ? (
    <div className={classes.signin_form__serverMessage}>Email or Password is invalid</div>
  ) : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.signin_form}>
      <div className={classes.signin_form__container}>
        <h2 className={classes.signin_form__title}>Sign In</h2>
        <label className={classes.signin_form__label}>Email address</label>
        <input
          className={`${classes.signin_form__input} ${errors?.email || error ? classes.input_error : ''}`}
          {...register('email', {
            required: 'Email is required field',
            pattern: {
              value: /^[\w-_.]+@[\w-]+\.[\w-.]+$/,
              message: 'Please enter valid mail',
            },
          })}
          type="email"
          placeholder="Email address"
        />
        {errorMessage('email')}
        <label className={classes.signin_form__label}>Password</label>
        <input
          className={`${classes.signin_form__input} ${errors?.password || error ? classes.input_error : ''}`}
          {...register('password', {
            required: 'Password is required field',
            pattern: {},
          })}
          type="password"
          placeholder="Password"
        />
        {errorMessage('password')}
        {serverErrorMessage}
        <button className={classes.signin_form__submit_button} disabled={isLoading} type="submit">
          {isLoading ? <ThreeDotsBounce color="white" /> : 'Login'}
        </button>
        <div className={classes.signin_form__signin_container}>
          <label className={classes.signin_form__signin_text}>Don’t have an account?</label>
          <Link to={SIGN_UP} className={classes.signin_form__signin_link}>
            Sign Up.
          </Link>
        </div>
        <div />
      </div>
    </form>
  )
}
