import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {Card,Chip,FlatButton,Dialog} from 'material-ui'
import './PostList.css';

export default function (props) {
  
    return (
      <div>
        {props.posts.map(post => {
          let myDocument = false;
          if(props.auth.getProfile().username===post._author.username){
            myDocument = true;
          }
          return (
            <Card className='post' key={post._id}>
              <div className="post-header">
              <Link className='post-title' to={'/dashboard/'+post._id}> {post.title} </Link>
                <Chip className={post.comments.length>0 ? 'badge-comments has-comments':'badge-comments'}>
                  {post.comments.length===1 ? "1 comment" : post.comments.length+" comments" }
                </Chip>
                <Dialog
                  title="Are you sure you want to delete this?"
                  modal={false}
                  open={props.dialogOpen}
                  onRequestClose={props.cancelDelete}
                >
                  <FlatButton
                    label="Cancel"
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={props.cancelDelete}
                  />
                  <FlatButton
                    label="Yes, delete!"
                    primary={true}
                    onTouchTap={props.confirmDelete.bind(null,post)} // for some reason, this binds to the previous post. That's why I use this.state.postToDelete in the dashboard
                  />
                </Dialog>
                {myDocument ? <i className="fa fa-trash-o"
                                 aria-hidden="true"
                                 onClick={props.deleteDocument.bind(null,post)}
                /> : null }


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