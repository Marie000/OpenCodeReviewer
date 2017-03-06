import React from 'react';
import Comment from './Comment';

export default function PostCommentList(props){
  return (
    <div>
        {props.comments.map(comment => {
            if (comment.is_general) {
              return (
                <Comment comment={comment} reload={props.reload} auth={props.auth} />
              )}
          }
        )}
    </div>
  )
}