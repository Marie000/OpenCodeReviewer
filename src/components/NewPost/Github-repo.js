let axios= require('axios');

import config from '../../../config';
const api = config.api;

const toIgnore=['node_modules','.gitignore'];

function getLanguage(filename){
  var ext = filename.substr(filename.lastIndexOf('.') + 1);
  switch(ext){
    case 'js'||'ts'||'jsx':
      return 'javascript';
    case 'htm' || 'html':
      return 'html';
    case 'css' || 'scss' || 'sass':
      return 'css';
    default:
      return 'text'
  }
}

let auth = '?client_id=baf7e465df12c2735d3a&client_secret=8f8f1b5d08cfc975c6bd595bcd97dc4d139e22f9'

export default function getGithubRepo(path,parent_id){
  axios.get(path+auth)
    .then((res)=>{
      res.data.map((fileFromList)=>{
        if(toIgnore.indexOf(fileFromList.name)===-1) {
          if (fileFromList.type === 'file') {
            console.log(fileFromList)
            axios.get(path + fileFromList.name)
              .then((res)=> {
                let newFile = {
                  _parent: parent_id,
                  is_folder: false,
                  name: res.data.name,
                  text: atob(res.data.content),
                  language: getLanguage(res.data.name)
                };
                axios.post(api+'/api/files/', newFile)
                  .then((file)=> {
                    console.log('file saved: ' + file)
                  })
              }, (e)=> {
                console.log(e)
              })
          } else {

            let newFolder = {
              _parent: parent_id,
              is_folder: true,
              name: fileFromList.name
            }
            axios.post(api+'/api/files/', newFolder)
              .then((res)=> {
                console.log('folder saved: ' + res.data.name)
                getGithubRepo(path + res.data.name + '/', res.data._id)
              }, (err)=> {
                console.log(err)
              })
          }
        }
      })
    })

}

