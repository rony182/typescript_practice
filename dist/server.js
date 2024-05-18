"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Notebook_1 = __importDefault(require("./models/Notebook"));
const UI_1 = __importDefault(require("./ui/UI"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static("public")); // Serve static files
// Initialize the notebook and UI
const notebook = new Notebook_1.default();
const ui = new UI_1.default(notebook);
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
        console.log(note);
        res.status(201).send({ message: "Note added successfully", note: note, parentId: parentId || null });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({ message: error.message });
        }
        else {
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(404).send({ message: error.message });
        }
        else {
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
    }
    else {
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
        }
        else {
            res.status(404).send({ message: "Note not found" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ message: error.message });
        }
        else {
            res.status(500).send({ message: "An unknown error occurred" });
        }
    }
});
exports.default = app;
