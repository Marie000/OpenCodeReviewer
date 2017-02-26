import React, {Component} from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {Card,Badge} from 'react-materialize';
import './PostList.css';

export default function (props) {
    return (
      <div>
        {props.posts.map(post => {
          return (
            <Card className='post'>
              <div className="post-header">
              <Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
              </div>
              {
                post.tags.map(tag => {
                  return <div key={tag} className="tags dashboard-tags" onClick={props.selectTagFromPost.bind(null,tag)}> {tag} </div>
                })
              }
              <div className="numberOfComments">
                <Badge className={post.comments.length>0 ? 'badge-comments has-comments':'badge-comments'}>{post.comments.length===1 ? "1 comment" : post.comments.length+" comments" }</Badge>
                <br/>
                Last comment: {moment(post.commentedAt).format("MMMM Do YYYY, h:mm:ss a")}
              </div>
              <div className="mrgTop10 mrgBtm10">
                Posted by
                  <Link className='link' to={'/profile/'+post._author._id}>{" "+post._author.user_name+" "}</Link>
                 on {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </div>
            </Card>
          )}
        )}
      </div>
    )
}