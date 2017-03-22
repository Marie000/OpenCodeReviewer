import React,{Component} from 'react';
import Comment from './Comment';
import axios from 'axios';
import config from '../../../../config';
const api=config.api || '';

export default class PostCommentList extends Component{
  constructor(props){
    super(props)
    this.state={
      thankButton:true,
      alreadyThanked:false,
      dialogOpen:false
    }
  }

  static contextTypes = {
    user: React.PropTypes.object
  };

  deleteComment(comment){
    this.setState({dialogOpen:comment._id})
  }

  confirmDelete(comment){
    console.log(comment)
    axios.delete(api+'/api/comments/'+comment._id,{headers:{Authorization: 'Bearer '+this.props.auth.getToken()}})
      .then((res)=>{
        this.props.reload()
      })
    this.setState({dialogOpen:false})
  }

  cancelDelete(){
    this.setState({dialogOpen:false})
  }
  render() {
    return (
      <div>
        {this.props.comments.map(comment => {
            if (comment.is_general) {
              return (
                <Comment comment={comment} 
                         reload={this.props.reload}
                         auth={this.props.auth}
                         dialogOpen={this.state.dialogOpen ? this.state.dialogOpen===comment._id  : false}
                         cancelDelete={this.cancelDelete.bind(this)}
                         confirmDelete={this.confirmDelete.bind(this)}
                         deleteComment={this.deleteComment.bind(this)}
                />
              )
            }
          }
        )}
      </div>
    )
  }
}