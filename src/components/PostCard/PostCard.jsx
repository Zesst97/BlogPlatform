/* eslint-disable react/no-array-index-key */
import React from 'react'
import { Link } from 'react-router-dom'
import { parse, format } from 'date-fns'
import { useSelector } from 'react-redux'

import defaultAvatar from '../../assets/images/avatar.png'
import { useToggleFavoritedMutation } from '../../api/api'
import { ARTICLES } from '../../utils/routes/routesPath'

import classes from './PostCard.module.scss'

function PostCard({ post }) {
  const { author, createdAt, description, favoritesCount, title, favorited, slug } = post
  const isLoggedIn = useSelector((state) => state?.auth.isLoggedIn)
  const tags = post.tagList
    .filter((tag) => tag.trim())
    .map((tag, index) => (
      <div className={classes.info_tags} key={`${tag}-${index}`}>
        {tag}
      </div>
    ))

  const formattedDate = createdAt
    ? // eslint-disable-next-line prettier/prettier
     format(parse(createdAt, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSX', new Date()), 'MMMM d, yyyy')
    : 'Date unknown'

  function truncateText(text, maxLength) {
    if (!text) {
      return ''
    }
    if (text.length <= maxLength) {
      return text
    }
    const truncatedText = `${text.slice(0, maxLength)}...`
    return truncatedText
  }

  // eslint-disable-next-line no-unused-vars
  const [addFavorited, { isLoading }] = useToggleFavoritedMutation()

  const handleLike = () => {
    const localToken = localStorage.getItem('token')
    const payload = { token: localToken, slug, favorited }
    addFavorited(payload)
  }

  return (
    <div className={classes.card}>
      <div className={classes.card__content}>
        <div className={classes.card__info}>
          <div className={classes.info_header}>
            <Link to={`${ARTICLES}/${post.slug}`}>
              <h2 className={classes.info_title}>{truncateText(title, 45)}</h2>
            </Link>
            <div className={classes.info_likes}>
              <button
                className={classes.like_button}
                type="button"
                disabled={isLoading || !isLoggedIn}
                onClick={handleLike}
              >
                {favorited ? '❤️' : '🤍'}
              </button>
              {favoritesCount}
            </div>
          </div>
          <div className={classes.info_tag_container}>{tags}</div>
        </div>
        <div className={classes.card__user}>
          <div className={classes.user_userInfo}>
            <div className={classes.user_userName}>{author.username}</div>
            <div className={classes.user_postDate}>{formattedDate}</div>
          </div>
          <img
            className={classes.user__avatar}
            src={author.image}
            alt="Avatar"
            onError={(e) => {
              e.target.src = defaultAvatar
            }}
          />
        </div>
      </div>
      <p className={classes.card__text}>{truncateText(description, 300)}</p>
    </div>
  )
}

export default PostCard
