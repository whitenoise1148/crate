import React from 'react';
// Importing firebase
import firebase from 'firebase';
// Importing Draft-JS-Editor component
import Editor from 'draft-js-editor';
import {convertToHTML, convertFromHTML, EditorState} from 'draft-js';


export default class NoteCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            note: props.note,
            isExpanded: false
        }
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.save = this.save.bind(this);
    }

    // Creating a function that is called by the <Editor/> component that enables Draft.js inside noteCard
    // const note is going to edit the key value of the this.state object in the constructor above so that we can change the value of note: {the contents of the note}
    handleEditorChange(editorState) {
        const newText = this.state.note;
        // By making newText.text = to convertToRaw(editorState) we take the content from editorState and make it a string which is easier to store in FireBase 
        newText.text = convertToRaw(editorState);
        this.setState({
            note: newText
        })

    }

// ===Allow the user to edit individual notes===
    save(e) {
        e.preventDefault();
        const dbRef = firebase.database().ref(this.props.note.key);

        dbRef.update({
            title: this.noteTile.value,
            text: this.noteText.value
        });

        this.setState({
            editing: false
        });
    }

// ===When user clicks a note apply class isExpanded to enlarge that note===

    handleToggle(e) {
        e.preventDefault();
        this.setState({
            isExpanded: !this.state.isExpanded
        })
    }

    render() {
        const { isExpanded } = this.state;
        let editingTemp = (
            <span>
                <h4>{this.state.note.title}</h4>
                <p>{this.state.note.text}</p>
            </span>
        )

        const closeButton = isExpanded ? (<input type="button" value='Close' onClick={this.handleToggle} />) : null;

        if(this.state.editing) {
            console.log(this.state.note.text);
            const contentState = convertFromRaw(this.state.note.text);
            const editorState = EditorState.createWithContent(contentState);
            // const editorState = EditorState.createWithContent('this.state.note.text');
            editingTemp = (
                <form onSubmit={this.save}>
                    <div>
                        <input type="text" defaultValue={this.state.note.title} name='title' ref={ref => this.noteTile = ref}/>
                    </div>
                    <div>
                        <Editor onChange={this.handleEditorChange} editorState={editorState} />
                        <input type="text" defaultValue={this.state.note.text} name='text' ref={ref => this.noteText = ref}/>
                    </div>
                    <input type="submit" value='Edit Complete' />
                </form>
            )
        }
        
        

        return (      
            <div className={`noteCard + ${isExpanded ? 'is-expanded' : ''}`} 
            onClick={isExpanded ? null : this.handleToggle}>
                <i className="fas fa-edit" onClick={() => this.setState({editing: true})}></i>
                <i className="fas fa-times" onClick={() => this.props.removeNote(this.props.note.key)}></i>
                {editingTemp}
                {closeButton}
            </div>
        )
    }
}