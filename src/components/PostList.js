import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {Card,Chip,FlatButton} from 'material-ui'
import './PostList.css';

export default function (props) {
    return (
      <div>
        {props.posts.map(post => {
          return (
            <Card className='post' key={post._id}>
              <div className="post-header">
              <Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
                <Chip className={post.comments.length>0 ? 'badge-comments has-comments':'badge-comments'}>{post.comments.length===1 ? "1 comment" : post.comments.length+" comments" }</Chip>
              </div>
              <div className="tag-list">
              {
                post.tags.map(tag => {
                  return <FlatButton key={tag}
                                     className="tag-button"
                                     onClick={props.tagClickable ? props.selectTagFromPost.bind(null,tag) : null}>
                    {tag} </FlatButton>
                })
              }
                </div>
              <br />
              <div className="post-footer">

                <span className="posted-by">Posted by
                  <Link className='author-name' to={'/profile/'+post._author.username}>{" "+post._author.username+" "}</Link>
                 on {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</span>

                {post.comments.length===0 ? null : <span className="last-comment">Last comment: {moment(post.commentedAt).format("MMMM Do YYYY, h:mm:ss a")}</span>}

              </div>
            </Card>
          )}
        )}
      </div>
    )
}