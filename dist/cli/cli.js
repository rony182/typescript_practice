"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const UI_1 = __importDefault(require("../ui/UI"));
const Notebook_1 = __importDefault(require("../models/Notebook"));
const notebook = new Notebook_1.default();
const ui = new UI_1.default(notebook);
// Configure CLI commands using yargs
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .scriptName("note-taker")
    .usage("$0 <cmd> [args]")
    .command({
    command: "add <title> <content> [parentId]",
    describe: "Add a new note, optionally as a child of another note",
    builder: {
        parentId: {
            describe: "The ID of the parent note under which this note will be added",
            type: "number"
        }
    },
    handler: (argv) => {
        if (argv.parentId) {
            ui.addNoteToNotebook(argv.title, argv.content, argv.parentId);
        }
        else {
            ui.addNoteToNotebook(argv.title, argv.content);
        }
    },
})
    .command({
    command: "remove <id>",
    describe: "Remove a note by ID, including all sub-notes",
    handler: (argv) => {
        ui.removeNoteFromNotebook(parseInt(argv.id));
    },
})
    .command({
    command: "display <id>",
    describe: "Display a note and its sub-notes by ID",
    handler: (argv) => {
        ui.displayNote(parseInt(argv.id));
    },
})
    .command({
    command: "list",
    describe: "List all top-level notes",
    handler: () => {
        ui.displayAllNotes();
    },
})
    .command({
    command: "update <id> <title> <content>",
    describe: "Update a note's title and content by ID",
    handler: (argv) => {
        const updatedNote = ui.updateNote(parseInt(argv.id), argv.title, argv.content);
        if (updatedNote) {
            console.log("Note updated successfully.");
        }
        else {
            console.log("Failed to find and update note.");
        }
    },
})
    .help()
    .alias("help", "h").argv;
