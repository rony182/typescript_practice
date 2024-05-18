// Type: Model
class Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: number; // Optional parent ID
  children: Note[]; // Array to store child notes

  // Constructor with id, title, and content parameters, optionally including parentId
  constructor(id: number, title: string, content: string, parentId?: number) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.parentId = parentId;
    this.children = []; // Initialize children as an empty array
  }

  // Method to update the content of the note
  updateContent(content: string): void {
    this.content = content;
    this.updatedAt = new Date();
  }

  // Method to add a child note
  addChild(note: Note): void {
    this.children.push(note);
  }

  // Optional: Method to remove a child note by ID
  removeChild(noteId: number): void {
    this.children = this.children.filter(note => note.id !== noteId);
  }
}

export default Note;
