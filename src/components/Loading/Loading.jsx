import React from 'react'
import { SpinnerDotted } from 'spinners-react'

import classes from './Loading.module.scss'

export default function Loading() {
  return (
    <div className={classes.loading}>
      <SpinnerDotted color="#2196F3" />
      <p className={classes.loading__text}>Загрузка постов...</p>
    </div>
  )
}
