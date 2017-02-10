import React, { Component } from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import learningCodeData from '../../services/learningCodeData';


export default class LearnCodeContent extends Component {
  constructor(props) {
    super(props);
    this.state={
      content:learningCodeData.list[this.props.params.page-1],
      displayGood:false
    }
  }

  toggleImage(){
    this.setState({displayGood:!this.state.displayGood})
  }

  componentWillReceiveProps(){
    this.setState({
      content:learningCodeData.list[this.props.params.page-1],
      displayGood:false
    })
  }

  render(){
    let goodImage = <img src={this.state.content.imgGood}/>
    let badImage = <img src={this.state.content.imgBad}/>
    return(
      <div>
        <h1>{this.state.content.title}</h1>
        {this.state.content.textBefore.map((text)=>{
          return <p key={text}>{text}</p>
        })}
        <button onClick={this.toggleImage.bind(this)}>Get {this.state.displayGood ? "bad" : "good"} Code</button>
        <br/>
        {this.state.displayGood ? <i className="fa fa-thumbs-up fa-3x"/> : <i className="fa fa-thumbs-down fa-3x"/>}
        <br />
        {this.state.displayGood ? goodImage : badImage}

        {this.state.content.textAfter.map((text)=>{
          return <p key={text}>{text}</p>
        })}

        {learningCodeData.list[this.props.params.page-2] ?
          <Link to={"/learn/code/"+(parseInt(this.props.params.page)-1)}>
          Previous: {learningCodeData.list[this.props.params.page-2].title}
          </Link>
          : null}
        {learningCodeData.list[this.props.params.page] ?
          <Link to={"/learn/code/"+(parseInt(this.props.params.page)+1)}>
            Next: {learningCodeData.list[this.props.params.page].title}
          </Link>
          : null}

      </div>
    )
  }
}

