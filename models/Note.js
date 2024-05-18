"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Type: Model
class Note {
    // Constructor with id, title, and content parameters, optionally including parentId
    constructor(id, title, content, parentId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.parentId = parentId;
        this.children = []; // Initialize children as an empty array
    }
    // Method to update the content of the note
    updateContent(content) {
        this.content = content;
        this.updatedAt = new Date();
    }
    // Method to add a child note
    addChild(note) {
        this.children.push(note);
    }
    // Optional: Method to remove a child note by ID
    removeChild(noteId) {
        this.children = this.children.filter(note => note.id !== noteId);
    }
}
exports.default = Note;
