import { Popconfirm, message } from 'antd';
import { format, parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useDeletePostMutation, useGetPostsBySlugQuery, useToggleFavoritedMutation } from '../../api/api';
import defaultAvatar from '../../assets/images/avatar.png';
import { ARTICLES } from '../../utils/routes/routesPath';
import Error from '../Error';
import Loading from '../Loading';

import classes from './PostDetails.module.scss';

function PostDetails() {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useGetPostsBySlugQuery(slug);
  const [deletePost, deleteResult] = useDeletePostMutation();
  const [toggleFavorited, { isLoading: isToggling }] = useToggleFavoritedMutation();
  const userData = useSelector((state) => state.auth.user);
  const localToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const [isFavorited, setIsFavorited] = useState(data?.article?.favorited || false);
  const [likesCount, setLikesCount] = useState(data?.article?.favoritesCount || 0);

  useEffect(() => {
    if (data?.article) {
      setIsFavorited(data.article.favorited);
      setLikesCount(data.article.favoritesCount);
    }
  }, [data]);

  useEffect(() => {
    if (deleteResult.isSuccess) {
      navigate(ARTICLES);
    }
  }, [deleteResult.isSuccess, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  if (!data?.article) {
    return <p>Post Not Found</p>;
  }

  const post = data.article;

  const formattedDate = post.createdAt
    ? format(parse(post.createdAt, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date()), 'MMMM d, yyyy')
    : 'Date unknown';

  const tags = post.tagList
    .filter((tag) => tag.trim())
    .map((tag, index) => (
      <div className={classes.info_tags} key={`${tag}-${index}`}>
        {tag}
      </div>
    ));

  const markDownBody = post.body;

  const showController = post.author.username === userData?.username;

  const handleLike = async () => {
    if (!localToken) return;

    try {
      await toggleFavorited({ token: localToken, slug, favorited: !isFavorited }).unwrap();
      setIsFavorited((prev) => !prev);
      setLikesCount((prev) => (isFavorited ? prev - 1 : prev + 1));
    } catch (err) {
      console.error('Ошибка при переключении лайка:', err);
    }
  };

  const handleEditButton = () => {
    navigate(`/articles/${slug}/edit`);
  };

  function confirm() {
    message.success('Click on Yes');
    const payload = { token: localToken, slug };
    deletePost(payload);
  }

  function cancel() {
    message.error('Click on No');
  }

  const userButtons = (
    <div className={classes.card_buttons}>
      <Popconfirm title="Are you sure to delete this post?" onConfirm={confirm} onCancel={cancel} okText="Yes" cancelText="No">
        <button className={classes.user_delete_button} type="button">
          Delete
        </button>
      </Popconfirm>
      <Link to="/articles/test-uoezkl/edit" className={classes.user_edit_button} onClick={handleEditButton}>
        Edit
      </Link>
    </div>
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <div className={classes.card__content}>
          <div className={classes.card__info}>
            <div className={classes.info_header}>
              <h2 className={classes.info_title}>{post.title}</h2>
              <div className={classes.likesContainer}>
                <button
                  className={classes.like_button}
                  type="button"
                  disabled={isToggling}
                  onClick={handleLike}
                  style={{ color: isFavorited ? 'red' : 'black' }}
                >
                  {isFavorited ? '❤️' : '🤍'}
                </button>
                <span className={classes.likes_count}>{likesCount}</span>
              </div>
            </div>
            <div className={classes.info_tag_container}>{tags}</div>
          </div>
          <div className={classes.card__user}>
            <div className={classes.user_userInfo}>
              <div className={classes.user_userName}>{post.author.username}</div>
              <div className={classes.user_postDate}>{formattedDate}</div>
            </div>
            <img
              className={classes.card__avatar}
              src={post.author.image}
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
              alt="Avatar"
            />
          </div>
        </div>
        <div className={classes.card__description_wrapper}>
          <div>
            <p className={classes.card__description}>{post.description}</p>
          </div>
          {showController ? userButtons : null}
        </div>
        <div className={classes.card__body}>
          <ReactMarkdown>{markDownBody}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
