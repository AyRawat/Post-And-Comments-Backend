import request from "supertest";
import app from "../index";
import { postCommentValidationRules } from "../validators/PostValidators";

describe("GET /", () => {
  it("returns Hello World", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toEqual(200);
  });
});

describe("POST /addPost", () => {
  test("returns 400 if title and description are missing", async () => {
    const response = await request(app).post("/addPost").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      mesage:
        "Please check the body, 'title' and 'description' are required fields",
      errors: [
        { msg: "Title is required", param: "title", location: "body" },
        {
          msg: "Description is required",
          param: "description",
          location: "body",
        },
      ],
    });
  });

  test("returns 200 and posts array if title and description are provided", async () => {
    const response = await request(app)
      .post("/addPost")
      .send({ title: "Test Post", description: "This is a test post" });

    expect(response.status).toBe(200);
    expect(response.body.posts).toBeDefined();
    expect(Array.isArray(response.body.posts)).toBe(true);
  });
});

describe("POST /addComment", () => {
  it("should return a 400 error if both post_id and parent_comment_id are missing", async () => {
    const response = await request(app).post("/addComment").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error:
        "post_id and comment_id both are missing. At least one of them is required",
    });
  });

  it("should return a 400 error if there are validation errors", async () => {
    const response = await request(app)
      .post("/addComment")
      .send({ title: "Test comment" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      mesage:
        "Please check the body, 'title' and 'description' are required fields",
      errors: [
        {
          value: undefined,
          msg: "Invalid value",
          param: "description",
          location: "body",
        },
      ],
    });
  });

  it("should return a 200 response with comments data if successful", async () => {
    const response = await request(app)
      .post("/addComment")
      .send({
        post_id: "20783694-598d-475d-8390-6da6f3e44390",
        body: "Test description",
      });

    expect(response.status).toBe(200);
    expect(response.body.comments).toEqual(expect.any(Array));
  });
});
