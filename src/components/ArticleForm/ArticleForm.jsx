/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { ThreeDotsBounce } from 'react-svg-spinners'

import classes from './ArticleForm.module.scss'

export default function ArticleForm({ onSubmit, isLoading, initialData = {} }) {
  const defaultValues = {
    title: initialData.title || '',
    description: initialData.description || '',
    body: initialData.body || '',
    tagList: initialData.tagList || [''],
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: 'onSubmit',
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tagList',
  })

  const onSubmitHandler = (data) => {
    onSubmit(data)
  }

  const submitButtonText = initialData.title ? 'Save' : 'Send'
  const buttonContent = isLoading ? <ThreeDotsBounce color="white" /> : submitButtonText

  return (
    <form className={classes.article_form} onSubmit={handleSubmit(onSubmitHandler)}>
      <div className={classes.article_form__container}>
        <h2 className={classes.article_form__title}>{initialData.title ? 'Edit article' : 'Create new article'}</h2>
        <label className={classes.article_form__label}>Title</label>
        <input
          className={`${classes.article_form__input} ${errors?.title ? classes.input_error : ''}`}
          {...register('title', {
            required: 'Title is required field',
            pattern: {
              message: 'Please enter valid mail',
            },
          })}
          type="text"
          placeholder="Title"
        />
        {errors?.title && <div className={classes.article_form_message}>{errors.title.message}</div>}
        <label className={classes.article_form__label}>Short description</label>
        <input
          className={`${classes.article_form__input} ${errors?.description ? classes.input_error : ''}`}
          {...register('description', {
            required: 'Short description is required field',
            pattern: {},
          })}
          type="text"
          placeholder="Title"
        />
        {errors?.description && <div className={classes.article_form_message}>{errors.description.message}</div>}
        <label className={classes.article_form__label}>Text</label>
        <textarea
          rows="9"
          className={`${classes.article_form__input_body} ${errors?.body ? classes.input_error : ''}`}
          {...register('body', {
            required: 'Body is required field',
            pattern: {},
          })}
          type="text"
          placeholder="Text"
        />
        {errors?.body && <div className={classes.article_form_message}>{errors.body.message}</div>}
        <label className={classes.article_form__label_tags}>Tags</label>
        <div className={classes.article_form__tags}>
          <div>
            {fields.map((item, index) => {
              return (
                <div key={item.id}>
                  <span>
                    <input
                      className={classes.article_form__tag}
                      {...register(`tagList.${index}`, { required: true })}
                      placeholder="Tag"
                    />
                    <button className={classes.article_form__delete_button} type="button" onClick={() => remove(index)}>
                      Delete
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
          <button
            className={classes.article_form__add_button}
            type="button"
            onClick={() => {
              append('')
            }}
          >
            Add tag
          </button>
        </div>
        <button className={classes.article_form__submit_button} disabled={isLoading} type="submit">
          {buttonContent}
        </button>
        <div />
      </div>
    </form>
  )
}
