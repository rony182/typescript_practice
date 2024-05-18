import request from "supertest";
import app from "./server";

describe("API tests", () => {
  let createdNoteId: number | undefined;

  beforeAll(async () => {
    const parentNote = {
      title: "Parent Note",
      content: "This is a parent note",
    };
    const response = await request(app).post("/api/notes").send(parentNote);
    if (response.statusCode === 201 && response.body.note) {
      createdNoteId = response.body.note.id;
    } else {
      console.error("Failed to create parent note:", response.body);
    }
  });

  test("POST /api/notes without parentId", async () => {
    const note = { title: "Test Note", content: "This is a test note" };
    const response = await request(app).post("/api/notes").send(note);
    expect(response.statusCode).toBe(201);
    console.log(response.body);

    expect(response.body).toHaveProperty("message", "Note added successfully");
    expect(response.body).toHaveProperty("parentId", null);
  });

  test("POST /api/notes with parentId", async () => {
    const childNote = {
      title: "Child Note",
      content: "This is a child note",
      parentId: createdNoteId,
    };
    const response = await request(app).post("/api/notes").send(childNote);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Note added successfully");
    expect(response.body).toHaveProperty("parentId", createdNoteId);
  });

  test("GET /api/notes", async () => {
    const response = await request(app).get("/api/notes");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([]));
  });

  test("GET /api/notes/:id to display nested structure", async () => {
    const response = await request(app).get(`/api/notes/${createdNoteId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", createdNoteId);
    expect(response.body).toHaveProperty("children");
  });

  test("PUT /api/notes/:id to update a note", async () => {
    const updatedNote = {
      title: "Updated Test Note",
      content: "Updated test note content",
    };
    const response = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .send(updatedNote);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Note updated successfully"
    );
  });

  test("DELETE /api/notes/:id with recursive delete", async () => {
    const response = await request(app).delete(`/api/notes/${createdNoteId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Note and all sub-notes removed successfully"
    );
  });
});
