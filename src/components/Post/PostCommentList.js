import React from 'react';
import moment from 'moment';
import {Link} from 'react-router';
import Comment from './Comment';

export default function PostCommentList(props){
  return (
    <div>
      <strong className="post-title mrgTop10 mrgBtm20"> Comments:  </strong>
      <ul >
        {props.comments.map(comment => {
            if (comment.is_general) {
              return (
                <Comment comment={comment} reload={props.reload} />
              )}
          }
        )}
      </ul>
    </div>
  )
}