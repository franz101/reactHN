import React from 'react';
import Comments from './Comments';
import { Link } from 'react-router-dom';
import { renderMarkup } from '../helpers';
import { CommentModel } from '../models/Comment';

interface ICommentProps {
  data: CommentModel
}

const Comment = (props: ICommentProps): JSX.Element => {
  const { data: comment } = props;
  return (
    <div
      className="comment"
      style={{ marginLeft: `${comment.level * 1}rem` }}
    >
      <div>
        <Link
          className="comment__author"
          to={`/user/${comment.user}`}
        >
          {comment.user}
        </Link> &nbsp;
        <span className="comment__timeAgo">{comment.time_ago}</span>
      </div>
      <div dangerouslySetInnerHTML={renderMarkup(comment.content)} />
      {comment.comments.length > 0
        ? <Comments data={comment.comments} />
        : ''
      }
    </div>
  );
}

export default Comment;