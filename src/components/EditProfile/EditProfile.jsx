/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useUpdateCurrentUserMutation } from '../../api/api'
import { ARTICLES } from '../../utils/routes/routesPath'
import { setUser } from '../../redux/auth/auth.slice'

import classes from './EditProfile.module.scss'

export default function EditProfile() {
  const localToken = localStorage.getItem('token')
  const [updateUser, result] = useUpdateCurrentUserMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.user)
  const { username, email } = userData || {}

  useEffect(() => {
    if (result.isSuccess) {
      dispatch(setUser(result.data.user))
      navigate(ARTICLES)
    }
  }, [result.isSuccess, navigate, setUser])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    mode: 'onchange',
    defaultValues: {
      username,
      email,
    },
  })

  const onSubmit = (data) => {
    const { image, ...rest } = data
    let payload = image ? { token: localToken, user: { ...data } } : { token: localToken, user: { ...rest } }
    if (image === '') {
      payload = { token: localToken, user: { ...rest } }
    }
    updateUser(payload)
    reset()
  }

  useEffect(() => {
    if (result.error) {
      Object.entries(result.error.data.errors).forEach(([key, value]) => {
        setError(key, { type: 'custom', message: `${key} ${value}` })
      })
    }
  }, [result])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.edit_form}>
      <div className={classes.edit_form__container}>
        <h2 className={classes.edit_form__title}>Edit Profile</h2>
        <label className={classes.edit_form__label}>Username</label>
        <input
          className={`${classes.edit_form__input} ${errors?.username ? classes.input_error : ''}`}
          {...register('username', {
            required: 'Username is required field',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
            maxLength: {
              value: 20,
              message: 'Username must not exceed 20 characters',
            },
          })}
          type="text"
          placeholder="New username"
        />
        {errors?.username && <div className={classes.edit_form__message}>{errors.username.message}</div>}
        <label className={classes.edit_form__label}>Email address</label>
        <input
          className={`${classes.edit_form__input} ${errors?.email ? classes.input_error : ''}`}
          {...register('email', {
            required: 'Email is required field',
            pattern: {
              value: /^[\w-_.]+@[\w-]+\.[\w-.]+$/,
              message: 'Please entere valid mail',
            },
          })}
          type="email"
          placeholder="New email address"
        />
        {errors?.email && <div className={classes.edit_form__message}>{errors.email.message}</div>}
        <label className={classes.edit_form__label}>Password</label>
        <input
          className={`${classes.edit_form__input} ${errors?.password ? classes.input_error : ''}`}
          {...register('password', {
            required: 'Password is required field',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
            maxLength: {
              value: 40,
              message: 'Password must not exceed 40 characters',
            },
            pattern: {},
          })}
          type="password"
          placeholder="New password"
        />
        {errors?.password && <div className={classes.edit_form__message}>{errors.password.message}</div>}
        <label className={classes.edit_form__label}>Avatar image (url)</label>
        <input
          className={`${classes.edit_form__input} ${errors?.image ? classes.input_error : ''}`}
          {...register('image', {
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: 'Invalid URL',
            },
          })}
          type="text"
          placeholder="Avatar image"
        />
        {errors?.image && <div className={classes.edit_form__message}>{errors.image.message}</div>}
        <button className={classes.edit_form__submit_button} type="submit">
          Save
        </button>
        <div />
      </div>
    </form>
  )
}
