import React, {Component} from 'react';
import { Link } from 'react-router';
import moment from 'moment'

export default function (props) {
    return (
      <ul>
        {props.posts.map(post => { return (
            <li className='post'>
              <Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
              <br/>
              {
                post.tags.map(tag => {
                  return <div key={tag} className="tags dashboard-tags" onClick={props.selectTagFromPost.bind(null,tag)}> {tag} </div>
                })
              }
              <div className="numberOfComments">
                {post.comments.length===1 ? "1 comment" : post.comments.length+" comments" }
                <br/>
                Last comment: {moment(post.commentedAt).format("MMMM Do YYYY, h:mm:ss a")}
              </div>
              <div className="mrgTop10 mrgBtm10">
                Posted by
                <span className="red">
                  <Link className='link' to={'/profile/'+post._author._id}>{post._author.user_name}</Link>
                </span>
                on {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </div>
            </li>
          )}
        )}
      </ul>
    )
}