import React from 'react';
import moment from 'moment';
import {Link} from 'react-router';

export default function PostCommentList(props){
  return (
    <div>
      <strong className="post-title mrgTop10 mrgBtm20"> Comments:  </strong>
      <ul >
        {props.comments.map(comment => {
            if (comment.is_general) {
              return (
                <li className='comment' key={comment._id}>
                  <div className="comment-header">
                    <Link className='link red' to={'/profile/'+comment._author._id}>{comment._author.user_name}</Link>
                    <span className = "comment-date"> Posted on {moment(comment.createdAt).format("MMMM Do YYYY, h:mm:ss a")} </span>
                  </div>
                  <div className = "comment-text"> {comment.text} </div>
                </li>
              )}
          }
        )}
      </ul>
    </div>
  )
}