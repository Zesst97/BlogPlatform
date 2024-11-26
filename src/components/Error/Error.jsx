import React from 'react'

import classes from './Error.module.scss'

export default function Error({ error }) {
  return (
    <div className={classes.error}>
      <p className={classes.error__message}>Произошла ошибка. Пожалуйста, попробуйте еще раз позднее.</p>
      <p className={classes.__details}>
        Код ошибки: {error.status} {error.message}
      </p>
    </div>
  )
}
