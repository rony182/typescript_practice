import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import UI from "./ui/UI";
import Notebook from "./models/Notebook";

// Initialize the notebook and UI
const notebook = new Notebook();
const ui = new UI(notebook);

// Configure CLI commands using yargs
yargs(hideBin(process.argv))
  .scriptName("note-taker") // Gives your CLI a name
  .usage("$0 <cmd> [args]") // Standard usage format
  .command({
    command: "add <title> <content> [parentId]",
    describe: "Add a new note, optionally under a parent note",
    builder: {
      parentId: {
        describe: "Parent note ID if adding a sub-note",
        type: 'number'
      }
    },
    handler: ({ title, content, parentId }) => {
      if (parentId) {
        ui.addNoteToNotebook(title, content, parentId);
      } else {
        ui.addNoteToNotebook(title, content);
      }
      console.log("Note added successfully.");
    },
  })
  .command({
    command: "remove <id>",
    describe: "Remove a note and all its sub-notes by ID",
    handler: ({ id }) => {
      ui.removeNoteFromNotebook(parseInt(id));
      console.log("Note removed successfully, along with all sub-notes.");
    },
  })
  .command({
    command: "display <id>",
    describe: "Display details of a note and its sub-notes by ID",
    handler: ({ id }) => {
      ui.displayNote(parseInt(id));
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
    describe: "Update the title and content of a note",
    handler: ({ id, title, content }) => {
      const result = ui.updateNote(parseInt(id), title, content);
      if (result) {
        console.log(`Note ID ${id} updated successfully.`);
      } else {
        console.log(`Note ID ${id} not found.`);
      }
    }
  })
  .demandCommand(1, "You must provide at least one command.")
  .help()
  .alias('help', 'h')
  .argv;
