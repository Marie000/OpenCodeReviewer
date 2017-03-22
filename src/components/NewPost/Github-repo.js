let axios= require('axios');

import config from '../../../config';
const api = config.api;

//export const toIgnore=['node_modules','.gitignore'];
export let toIgnore = {
  defaultList:['node_modules','.gitignore']
};
function returnToIgnoreToDefault(){
  toIgnore={
    defaultList:['node_modules','.gitignore']
  }
}

export {returnToIgnoreToDefault}

const extensionsToIgnore=['png', 'jpg','jpeg' ,'aif','midi','wav','mp3','mpa','wma','rar','zip','gz','bin','iso','csv',
  'dat','sql','tar','xml','fnt','fon','ai','bmp','gif','ico','ps','psd','svg','tif','tiff','avi','flv','m4v','mkv','mov',
  'mp4','mpg','mpeg','rm','swf','vob','wmv','pdf']

function filterFiles(file,path){
  console.log('filterFiles: ')
  console.log(file)
  console.log(path)
  console.log(toIgnore)
  if(toIgnore[path]) {
    if (toIgnore[path].indexOf(file) > -1) {
      console.log('in banned file list')
      return false;
    }
    let extension = file.substr(file.lastIndexOf('.') + 1);
    if (extensionsToIgnore.indexOf(extension) > -1) {
      return false;
    }
  }
  return true;
}

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

let count = 0;
export default function getGithubRepo(path,parent_id,doc_id,file_path){
  axios.get(path+auth)
    .then((res)=>{
      console.log(res)
      res.data.map((fileFromList)=>{
        count++;
        // max 30 files
        if(filterFiles(fileFromList.name,file_path)&&count<31) {
          console.log('passed filterfiles')
          if (fileFromList.type === 'file') {
            axios.get(path + fileFromList.name)
              .then((res)=> {
                let newFile = {
                  _parent: parent_id,
                  _document:doc_id,
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
              _document:doc_id,
              is_folder: true,
              name: fileFromList.name
            }
            axios.post(api+'/api/files/', newFolder)
              .then((res)=> {
                getGithubRepo(path + res.data.name + '/', res.data._id, doc_id, res.data.name)
              }, (err)=> {
                console.log(err)
              })
          }
        } 
      })
    })

}

