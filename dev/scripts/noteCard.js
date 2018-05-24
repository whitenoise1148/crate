import React from 'react';
// Importing firebase
import firebase from 'firebase';

export default class NoteCard extends React.Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            note: {},
            isExpanded: false
        }
        this.handleToggle = this.handleToggle.bind(this);
        this.save = this.save.bind(this);
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
                <h4>{this.props.note.title}</h4>
                <p>{this.props.note.text}</p>
            </span>
        )

        const closeButton = isExpanded ? (<input type="button" value='Close' onClick={this.handleToggle} />) : null;

        if(this.state.editing) {
            editingTemp = (
                <form onSubmit={this.save}>
                    <div>
                        <input type="text" defaultValue={this.props.note.title} name='title' ref={ref => this.noteTile = ref}/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.props.note.text} name='text' ref={ref => this.noteText = ref}/>
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