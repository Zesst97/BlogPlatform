import React, { useState } from 'react'
import { Pagination } from 'antd'

import PostCard from '../PostCard'
import { useGetPostsQuery } from '../../api/api'
import Loading from '../Loading'
import Error from '../Error'

import classes from './PostList.module.scss'

function PostList() {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const { data, isLoading, isError, error } = useGetPostsQuery({ offset: (currentPage - 1) * 10, limit: 10 })

  const posts = data?.articles || []
  const totalPosts = data?.articlesCount || []
  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error error={error} />
  }

  return (
    <div className={classes.listContainer}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        defaultCurrent={1}
        showSizeChanger={false}
        total={totalPosts}
        style={{
          marginBottom: '25px',
        }}
      />
    </div>
  )
}

export default PostList
