import express from "express";
import Notebook from "./models/Notebook";
import UI from "./ui/UI";

const app = express(); // Create an Express app
app.use(express.json()); // Parse JSON bodies
app.use(express.static("public"));  // Serve static files

// Initialize the notebook and UI
const notebook = new Notebook();
const ui = new UI(notebook);

// API endpoints
// GET all top-level notes
app.get("/api/notes", (req, res) => {
  res.json(ui.getNotes());
});

// POST a new note, optionally under a parent note
app.post("/api/notes", (req, res) => {
  const { title, content, parentId } = req.body;
  try {
    const note = ui.addNoteToNotebook(title, content, parentId);
    // Return the created note and parentId if provided   
    res.status(201).send({ message: "Note added successfully", note: note, parentId: parentId || null });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(400).send({ message: "An unknown error occurred" });
    }
  }
});

// DELETE a note and its sub-notes
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  try {
    ui.removeNoteFromNotebook(parseInt(id));
    res.send({ message: "Note and all sub-notes removed successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send({ message: error.message });
    } else {
      res.status(404).send({ message: "An unknown error occurred" });
    }
  }
});

// GET a single note by ID, including sub-notes
app.get("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const note = ui.getNoteById(parseInt(id));
  if (note) {
    res.json(note);
  } else {
    res.status(404).send({ message: "Note not found" });
  }
});

// PUT to update a note
app.put("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const note = ui.updateNote(parseInt(id), title, content);
    if (note) {
      res.json({ message: "Note updated successfully", note });
    } else {
      res.status(404).send({ message: "Note not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unknown error occurred" });
    }
  }
});

export default app;
