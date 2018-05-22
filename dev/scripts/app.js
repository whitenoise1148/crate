import React from 'react';
import ReactDOM from 'react-dom';
import NoteCard from './noteCard';
// Importing firebase
import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAe3KN7_f_LHJxz-kHP5bwZn6lvuMORrFw",
  authDomain: "note-codealong.firebaseapp.com",
  databaseURL: "https://note-codealong.firebaseio.com",
  projectId: "note-codealong",
  storageBucket: "note-codealong.appspot.com",
  messagingSenderId: "16821715770"
};
firebase.initializeApp(config);


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      notes: []
    }
    this.showSidebar = this.showSidebar.bind(this);
    this.addNote = this.addNote.bind(this);
  }
  componentDidMount() {
    firebase.database().ref().on('value', (res) => {
      const userData = res.val();
      const dataArray = [];
      for(let noteKey in userData) {
        userData[noteKey].key = noteKey;
        dataArray.push(userData[noteKey])
      }
      this.setState({
        notes: dataArray
      })
    });
  }
  
  showSidebar(e) {
    e.preventDefault();
    this.sidebar.classList.toggle('show');
  }
  
  addNote(e) {
    e.preventDefault();
    const note = {
      title: this.noteTitle.value,
      text: this.noteText.value
    }

    const dbRef = firebase.database().ref();

    dbRef.push(note);

    this.noteTitle.value = '';
    this.noteText.value = '';
    this.showSidebar(e);
  }
  
  removeNote(noteID) {
    const dbRef = firebase.database().ref(noteID);
    dbRef.remove();
  }
  
  render() {
      return (
        <div>
          <header className='mainHeader'>
            <h1>Crate</h1>
            <nav className='headerNav'>
              <a href='' onClick={e => this.showSidebar(e)}>Add New Note</a>
            </nav>
          </header>
          <section className="notes">
            {this.state.notes.map((note,i) => {
              return (
                <NoteCard note={note} key={`note-${i}`} removeNote={this.removeNote} />
              )
            }).reverse()}
          </section>
          <aside className="sidebar" ref={ref => this.sidebar = ref}>
            <form onSubmit={this.addNote}>
              <h3>Add New Note</h3>
              <div className="close-btn" onClick={this.showSidebar}>
                <i className="fas fa-times"></i>
              </div>
              <label htmlFor="note-title">Title:</label>
              <input type="text" name="note-title" ref={ref => this.noteTitle = ref }/>
              <label htmlFor="note-text">Text:</label>
              <textarea name='note-text' ref={ref => this.noteText = ref}></textarea>
              <input type="submit" value='Add New Note'/>
            </form>
          </aside>
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
