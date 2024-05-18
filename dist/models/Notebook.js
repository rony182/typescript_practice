"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Notebook class
class Notebook {
    constructor() {
        this.notes = [];
    }
    // Add a note to the notebook, optionally with a parentId
    addNote(note) {
        if (note.parentId !== undefined) {
            const parent = this.getNote(note.parentId);
            if (parent) {
                parent.addChild(note); // Add as a child to the parent note
            }
            else {
                throw new Error("Parent note not found");
            }
        }
        else {
            this.notes.push(note); // Add as a top-level note
        }
    }
    // Remove a note and all its children recursively
    removeNote(id) {
        const noteToRemove = this.getNote(id);
        if (noteToRemove) {
            // Remove all child notes recursively
            noteToRemove.children.forEach(child => this.removeNote(child.id));
            // Remove the note itself from its parent or from top-level notes
            if (noteToRemove.parentId !== undefined) {
                const parent = this.getNote(noteToRemove.parentId);
                parent === null || parent === void 0 ? void 0 : parent.removeChild(id);
            }
            else {
                this.notes = this.notes.filter(note => note.id !== id);
            }
        }
    }
    // Get a note by ID, includes searching within children
    getNote(id) {
        let foundNote = this.notes.find(note => note.id === id);
        if (!foundNote) {
            for (const note of this.notes) {
                foundNote = this.findNoteRecursive(note, id);
                if (foundNote)
                    break;
            }
        }
        return foundNote;
    }
    // Recursive helper method to find a note by ID within a note's children
    findNoteRecursive(note, id) {
        if (note.id === id) {
            return note;
        }
        for (const child of note.children) {
            const found = this.findNoteRecursive(child, id);
            if (found)
                return found;
        }
        return undefined;
    }
    // Update a note by ID
    updateNote(id, title, content) {
        const note = this.getNote(id);
        if (note) {
            note.title = title;
            note.content = content;
            return note;
        }
        return undefined;
    }
    // List all top-level notes, does not include children
    listNotes() {
        return this.notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
exports.default = Notebook;
