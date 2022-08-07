import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

class RichTextEditor extends Component {
    
	constructor(props) {
		super(props);
		if (document) {
			this.quill = require('react-quill')
		}

		this.modules = {
			toolbar: [
		      [{ 'font': [] }],
		      [{ 'size': ['small', false, 'large', 'huge'] }],
		      ['bold', 'italic', 'underline'],
		      [{'list': 'ordered'}, {'list': 'bullet'}],
		      [{ 'align': [] }],
			  [ 'link', 'image', 'video', 'formula' ],
		      [{ 'color': [] }, { 'background': [] }],
		      ['clean']
		    ]
		};

		this.formats = [
		    'font',
		    'size',
		    'bold', 'italic', 'underline',
		    'list', 'bullet',
		    'align',
		    'color', 'background'
	  	];

	  	this.state = {
			comments: 'Gönderinizi buraya ekleyin.'
		}

		this.rteChange = this.rteChange.bind(this);
	}

	rteChange = (content, delta, source, editor) => {
		console.log(editor.getHTML()); // rich text
		console.log(editor.getText()); // plain text
		console.log(editor.getLength()); // number of characters
	}

	render() {
		const Quill = this.quill
    	if (Quill) {
			return (
				<div className='w-full'>
					<form action="">
						<div className="mb-6">
							<input type="text" id="title" placeholder="Başlık"  name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-eksiCode focus:border-eksiCode block w-full p-2.5" />
						</div>
						<div className="mb-6">
							<input type="text" id="tags" placeholder="Etiketler"  name="tags" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-eksiCode focus:border-eksiCode block w-full p-2.5" />
						</div>
						<ReactQuill theme="snow"  className="h-full" modules={this.modules}
							formats={this.formats} onChange={this.rteChange}
						value={this.state.comments || ''}/>
					</form>
				</div>
			);
		} else {
			return null
		}
	}

}

export default RichTextEditor;