import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import apiUrl from '../../config/apiUrl';
import appStore from "../../stores/appStore";
import {errorMessage} from "../../request";

function uploadCallback(file) {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl.UPLOAD_IMAGE_URL);
      xhr.setRequestHeader('Authorization', `Bearer ${appStore.token}`);
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    // this.state = {value: ''};
    this.quillModules = {
      toolbar: {
        container: [
          [{header: [1, 2, false]}, {font: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'align': [] }],
          [
            {list: 'ordered'},
            {list: 'bullet'},
            {indent: '-1'},
            {indent: '+1'}
          ],
          ['link', 'image', 'video'],
          ['clean'],

        ],
        handlers: {
          'image': this.imageHandler
        }
      }
    };
  }

  imageHandler = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = () => this.imageChange(input.files);
    //let value = prompt('What is the image URL');
    // if(value) {
    //     this.quillRef.getEditor().insertEmbed(range.index, 'image', value, "user");
    // }
  };

  imageChange = (files) => {
    let data = uploadCallback(files[0]);
    data.then(value => {
      console.log("%cupload response...", 'color: #00b33c', value);
      if (value && Array.isArray(value.files)) {
        let range = this.quillRef.getEditor().getSelection();
        this.quillRef.getEditor().insertEmbed(range.index, 'image', value.files[0].url, "user");
      }
    }).catch(e => {
      errorMessage(e);
      throw e;
    })
  };

  handleChange(value) {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const {value, placeholder} = this.props;
    const options = {
      theme: 'snow',
      formats: Editor.formats,
      placeholder: placeholder || 'Write Something',
      value: value || null,
      onChange: this.handleChange,
      modules: this.quillModules
    };
    return <ReactQuill {...options} ref={(el) => this.quillRef = el}/>;
  }
}
