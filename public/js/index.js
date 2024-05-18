$(document).ready(function () {
  fetchNotes();

  // Handle form submission
  $("#submit-btn").click(function () {
    const id = $(this).data("id");
    const parentId = $("#parentId").val();
    if (id) {
      updateNoteById(id);
    } else {
      addNote(parentId);
    }
    // Clear the parent ID input field
    $("#parentId").val("");
  });

  function addNote(parentId) {
    const title = $("#noteTitle").val();
    const content = $("#noteContent").val();
    const note = { title, content, parentId: parseInt(parentId) || undefined };

    $.ajax({
      url: "/api/notes",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(note),
      success: function (data) {
        console.log("Note added:", data);
        fetchNotes();
        resetForm();
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }

  function fetchNotes() {
    $.ajax({
      url: "/api/notes",
      type: "GET",
      success: function (data) {
        displayNotes(data);
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }

  function displayNotes(notes) {
    const notesList = $("#notesList");
    notesList.empty(); // Clear the list

    function renderNotes(notes, container) {
      $.each(notes, function (i, note) {
        const noteElement = $("<div>").addClass("note");
        noteElement.html(
          `<div class="note-content">
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    <button data-id="${note.id}" class="delete-btn btn btn-danger">Delete</button>
                    <button data-id="${note.id}" class="edit-btn btn btn-primary">Edit</button>
                    <button data-id="${note.id}" class="add-parent-btn btn btn-success">Add as Parent</button>
                </div>`
        );

        // If this note has children, create a container for them
        if (note.children && note.children.length > 0) {
          const childrenContainer = $("<div>").addClass("note-children"); // Create a container for child notes
          noteElement.append(childrenContainer); // Append the container for child notes
          renderNotes(note.children, childrenContainer); // Recursively render child notes
        }
        // Append the note to the parent container
        container.append(noteElement);
      });
    }

    // Start the recursive rendering with the top-level notes and the main container
    renderNotes(notes, notesList);
  }

  // Handle parent button clicks
  $(document).on("click", ".add-parent-btn", function () {
    // Get the ID of the note to set as parent
    const id = $(this).data("id");
    // Reset all other buttons (ensure only one parent can be active at a time)
    $(".remove-parent-btn")
      .text("Add as Parent")
      .removeClass("remove-parent-btn")
      .addClass("add-parent-btn");
    // Change the button text and class
    $(this)
      .text("Remove Parent")
      .removeClass("add-parent-btn")
      .addClass("remove-parent-btn");

    // Set the parent ID input field
    $("#parentId").val(id);
  });

  $(document).on("click", ".remove-parent-btn", function () {
    $("#parentId").val(""); // Clear the parent ID input field
    $(this)
      .text("Add as Parent")
      .removeClass("remove-parent-btn")
      .addClass("add-parent-btn");
  });

  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    deleteNoteById(id);
  });

  function deleteNoteById(id) {
    $.ajax({
      url: `/api/notes/${id}`,
      type: "DELETE",
      success: function (data) {
        console.log("Note deleted:", data);
        fetchNotes();
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }

  $(document).on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    editNoteById(id);
  });

  function editNoteById(id) {
    $.ajax({
      url: `/api/notes/${id}`,
      type: "GET",
      success: function (data) {
        console.log("Note to edit:", data);
        $("#noteTitle").val(data.title);
        $("#noteContent").val(data.content);
        $("#submit-btn").data("id", id).text("Update");
        toggleCancelButton(true);
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }

  $(document).on("click", "#cancel-btn", function () {
    resetForm();
  });

  function updateNoteById(id) {
    const title = $("#noteTitle").val();
    const content = $("#noteContent").val();
    const note = { title, content };

    $.ajax({
      url: `/api/notes/${id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(note),
      success: function (data) {
        console.log("Note updated:", data);
        fetchNotes();
        resetForm();
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }

  function resetForm() {
    $("#noteTitle").val("");
    $("#noteContent").val("");
    $("#submit-btn").removeData("id").text("Add Note");
    toggleCancelButton(false);
  }

  function toggleCancelButton(show) {
    if (show) {
      $("#submit-btn").after(
        '<button id="cancel-btn" class="ml-2 btn btn-secondary">Cancel</button>'
      );
    } else {
      $("#cancel-btn").remove();
    }
  }
});
