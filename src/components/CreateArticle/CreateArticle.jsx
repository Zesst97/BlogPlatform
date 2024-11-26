import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCreatePostMutation } from '../../api/api'
import ArticleForm from '../ArticleForm'
import { ARTICLES } from '../../utils/routes/routesPath'

export default function CreateArticle() {
  const [createPost, { isSuccess, isLoading }] = useCreatePostMutation()
  const localToken = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      navigate(ARTICLES)
    }
  }, [isSuccess, navigate])

  const onSubmit = (data) => {
    const payload = { token: localToken, post: data }
    createPost(payload)
  }

  return <ArticleForm onSubmit={onSubmit} isLoading={isLoading} />
}
