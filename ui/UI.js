"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Note_1 = __importDefault(require("../models/Note"));
// UI class
class UI {
    constructor(notebook) {
        this.notebook = notebook;
    }
    // Add a note with optional parent ID for nested notes
    // UI class method modified to return the created note object
    addNoteToNotebook(title, content, parentId) {
        const id = Date.now();
        const note = new Note_1.default(id, title, content, parentId);
        this.notebook.addNote(note);
        console.log(`Note added successfully${parentId ? ` under parent ID ${parentId}` : ""}.`);
        return note;
    }
    // Remove a note and its children if any
    removeNoteFromNotebook(id) {
        this.notebook.removeNote(id);
        console.log("Note and all sub-notes removed successfully.");
    }
    // Display a note by ID, including its children
    displayNote(id) {
        const note = this.notebook.getNote(id);
        if (note) {
            this.printNoteDetail(note);
            if (note.children.length > 0) {
                console.log("Sub-notes:");
                note.children.forEach((child) => this.printNoteDetail(child));
            }
        }
        else {
            console.log("Note not found.");
        }
    }
    // Helper function to print details of a note
    printNoteDetail(note) {
        console.log(`ID: ${note.id} - Title: ${note.title}`);
        console.log(`Content: ${note.content}`);
        console.log(`Last Updated: ${note.updatedAt.toLocaleString()}`);
    }
    // Display all top-level notes
    displayAllNotes() {
        const notes = this.notebook.listNotes();
        notes.forEach((note) => {
            console.log(`ID: ${note.id} - Title: ${note.title}`);
            // Optionally list child notes here if needed
        });
    }
    // Retrieve all notes, including nested structure
    getNotes() {
        return this.notebook.listNotes();
    }
    // Get a single note by ID, without children
    getNoteById(id) {
        return this.notebook.getNote(id);
    }
    // Update a note
    updateNote(id, title, content) {
        const updatedNote = this.notebook.updateNote(id, title, content);
        if (updatedNote) {
            console.log("Note updated successfully.");
            return updatedNote;
        }
        else {
            console.log("Note not found.");
            return undefined;
        }
    }
}
exports.default = UI;
