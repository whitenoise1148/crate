import React from 'react';
import firebase from 'firebase';

export default class NoteCard extends React.Component {
    constructor() {
        super();
        this.state = {
            editing: false,
            note: {}
        }
        this.save = this.save.bind(this);
    }

    save(e) {
        e.preventDefault();
        console.log(this);
        const dbRef = firebase.database().ref(this.props.note.key);

        dbRef.update({
            title: this.noteTile.value,
            text: this.noteText.value
        });

        this.setState({
            editing: false
        });
    }
    render() {
        let editingTemp = (
            <span>
                <h4>{this.props.note.title}</h4>
                <p>{this.props.note.text}</p>
            </span>
        )
        if(this.state.editing) {
            editingTemp = (
                <form onSubmit={this.save}>
                    <div>
                        <input type="text" defaultValue={this.props.note.title} name='title' ref={ref => this.noteTile = ref}/>
                    </div>
                    <div>
                        <input type="text" defaultValue={this.props.note.text} name='text' ref={ref => this.noteText = ref}/>
                    </div>
                    <input type="submit" value='Done editing!' />
                </form>
            )
        }
        return (
            <div className="noteCard">
                <i className="fas fa-edit" onClick={() => this.setState({editing: true})}></i>
                <i className="fas fa-times" onClick={() => this.props.removeNote(this.props.note.key)}></i>
                {editingTemp}
            </div>
        )
    }
}