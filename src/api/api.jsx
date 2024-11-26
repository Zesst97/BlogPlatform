import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import postsEndpoints from './endpoints/posts'
import usersEndpoints from './endpoints/users'
// const API_URL = 'https://api.realworld.io/api'
const API_URL = 'https://blog-platform.kata.academy/api/'

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['post'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    ...postsEndpoints(builder),
    ...usersEndpoints(builder),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostsBySlugQuery,
  useLazyGetPostsQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdateAnArticleMutation,
  useToggleFavoritedMutation,
} = api
