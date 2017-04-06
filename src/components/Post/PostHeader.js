import React from 'react';

export default function PostHeader(props){
  return (
    <div>
      <h2>{props.title}</h2>
      <div className='col-md-10 postdescription'> {props.description} </div>
      <div className='col-md-10 postdescription'><a href={props.url}>Project URL</a></div>

      <div className='row'>
        <div className='col-md-10'>
          {props.tags.map(tag => { return <div key={tag} className="tags"> {tag}</div>}
          )}
        </div>
      </div>
    </div>
  )
}