import React, {Component} from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {Card,Badge,Button} from 'react-materialize';
import './PostList.css';

export default function (props) {
    return (
      <div>
        {props.posts.map(post => {
          return (
            <Card className='post'>
              <div className="post-header">
              <Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
                <Badge className={post.comments.length>0 ? 'badge-comments has-comments':'badge-comments'}>{post.comments.length===1 ? "1 comment" : post.comments.length+" comments" }</Badge>
              </div>
              <div className="tag-list">
              {
                post.tags.map(tag => {
                  return <Button key={tag} className="tag-button" onClick={props.selectTagFromPost.bind(null,tag)}> {tag} </Button>
                })
              }
                </div>
              <br />
              <div className="post-footer">

                <span className="posted-by">Posted by
                  <Link className='author-name' to={'/profile/'+post._author._id}>{" "+post._author.user_name+" "}</Link>
                 on {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</span>

                {post.comments.length===0 ? null : <span className="last-comment">Last comment: {moment(post.commentedAt).format("MMMM Do YYYY, h:mm:ss a")}</span>}

              </div>
            </Card>
          )}
        )}
      </div>
    )
}