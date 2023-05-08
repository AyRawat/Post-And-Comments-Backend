# Post and Comments

This is a simple Back-end for Post and Comments. A Post can have multiple comments, and those comments can have nested comments on them as well

## Installation

```bash
  * git clone https://github.com/AyRawat/Post-And-Comments-Backend.git
  * cd Post-And_Comments-Backend
  * rename .env.sample to .env
  * docker compose up -d --build
```

I have tried my best to make this easy to setup in any environment, thats why I have made Postgres a part of this app, using Docker Compose.

**NOTE**
You also need to run the sql script manually in order to create the Tables.
The db scripts are inside the migrations,
Or you can also call db.migrations() only once by calling it in the index.js

Open up your favorite browser and navigate to http://localhost:3000/api/ and you should see "Hello World".

## Functionality

1. Add a Post.
2. Add a comment on the post.
3. Add a comment on a comment.
4. Get Posts and Comments.

## Dependencies

1. Typescript - Used it for type safety and code maintainabilty
2. express - A lightweight Node.js framework which provides a lot of additional features.
3. pg - For connecting Node.js app to Postgres
4. Helmet - helmet is a middleware for Express-based applications that helps secure them by setting various HTTP headers
5. jest - For testing the App.
6. supertest - For testing HTTP requests.
7. express-validator - For validating the incoming requests.

## Challenges

1. Finding a way to store nested comments.
   A comment can have any number of nested child comments. Storing them in a table is the most tricky part. I used self referential values, by adding a column called "parent_comment_id". If this value is empty, that means it is the first comment on the post. Otherwise I can always find out, whose child comment is this.

2. Getting the comments in a Hierarichal Structure.
   I used a recursive Query along with self join to fetch the data. But the data came in tabular format. Also, I needed to keep the track of the level of the child, so I added an extra column, only while fetching, called "levels" to know the exact level of child. To get the data in Hierarichal Structure, I wrote a js function, which on the basis of level and parent_comment_id, created the whole tree structure.

## Future Optimisations

1. Typescript. The types can be created and inferred better. I have tried to cover most of areas using ts, but still there are some places where strong typing can help.

2. Postgres. This kind of data represents tree data structure, and in order to store it in DB. ITree data type in Postgres can make things a lot easier.

## API Reference

#### Get Posts - /api/getPosts

- Description : Get all Posts , in order, latest to oldest.
- Output Structure :

```
{
id : Unique Id of Post
title : Title of the Post
description : Details on Post
created_at : Time when the Post was created
comments : The First level comment on the post
}
```

- API Call

```
curl --location 'http://localhost:3000/api/getPosts' \
--header 'Content-Type: application/json'
```

- Response

```
 [
    {
        "id": "78458d70-a7fc-4287-b0b3-fb659d5162e6",
        "title": "Third Post",
        "description": "This is the Third Post's Description",
        "created_at": "2023-05-04T22:06:40.650Z",
        "comments": "This is the 1st comment on 3rd Post."
    },
    {
        "id": "d2601dda-dd2b-46b7-af5a-72a85bbef69b",
        "title": "Second Post",
        "description": "This is the Second Post's First Comment",
        "created_at": "2023-05-04T08:27:11.652Z",
        "comments": "This is the 1st comment on 2nd Post."
    },
    {
        "id": "20783694-598d-475d-8390-6da6f3e44390",
        "title": "First Post",
        "description": "This is what first post looks like.",
        "created_at": "2023-05-04T00:30:15.107Z",
        "comments": "Why first comment?"
    }
]

```

#### POST - Add Post - /api/addPost

- Description : Adds a Post and lists down all the Posts from latest to Oldest
- Payload Details

```
| Parameter  | Type   | Description|
-------------------------------------
| title      | string | Title of the Post. **Required**
| description| string | Description about the post **Required**

{
    "title":"Fourth Post",
    "description" : "This is the Fourth Post's Description"
}
```

- Sample API Call

```
curl --location 'http://localhost:3000/api/addPost' \
--header 'Content-Type: application/json' \
--data '{
    "title":"Fourth Post",
    "description" : "This is the Fourth Post'\''s Description"
}
```

- Response

```
[
    {
        "id": "bf569ad3-6c11-43e6-8893-ee4eaeee691d",
        "title": "Fourth Post",
        "description": "This is the Fourth Post's Description",
        "created_at": "2023-05-04T23:14:08.035Z",
        "comments": "This is the 1st comment on 4th Post."
    },
    {
        "id": "78458d70-a7fc-4287-b0b3-fb659d5162e6",
        "title": "Third Post",
        "description": "This is the Third Post's Description",
        "created_at": "2023-05-04T22:06:40.650Z",
        "comments": "This is the 1st comment on 3rd Post."
    },
    {
        "id": "d2601dda-dd2b-46b7-af5a-72a85bbef69b",
        "title": "Second Post",
        "description": "This is the Second Post's First Comment",
        "created_at": "2023-05-04T08:27:11.652Z",
        "comments": "This is the 1st comment on 2nd Post."
    },
    {
        "id": "20783694-598d-475d-8390-6da6f3e44390",
        "title": "First Post",
        "description": "This is what first post looks like.",
        "created_at": "2023-05-04T00:30:15.107Z",
        "comments": "Why first comment?"
    }
]
```

### POST Save Comments - /api/addComment

- Description: Adds a Comment to the Post and results in Get Posts format

- Payload

```
| Parameter        | Type  | Description|
-----------------------------------------
|post_id           |String | id of the Post to comment
|parent_comment_id |String | id of the Comment
|text              |String | Title of the card **Required

**NOTE** either post_id or parent_comment_id is required. Both can't be empty
```

- Sample Request

```
# For Adding a comment to Comment
curl --location 'http://localhost:3000/api/addComment' \
--header 'Content-Type: application/json' \
--data '{
    "parent_comment_id":"2010e9d7-916b-469c-9c6d-01d05e572f56",
    "text": "This is the 2nd level comment on 4th Post."
}'
```

- Response

```
{
    "comments": {
        "id": "b49fdd31-0229-42d3-b46b-76c672c28370",
        "post_id": null,
        "parent_comment_id": "2010e9d7-916b-469c-9c6d-01d05e572f56",
        "body": "This is the 2nd level comment on 4th Post.",
        "created_at": "2023-05-05T00:14:00.611Z"
    }
}
```

### Get Comments - /api/getComments

- Description: Get the comments , either on Post or Comment.

- Payload - In Query Params

```
| Parameter   | Type  | Description|
-----------------------------------------
|post_id      |String | id of the Post
|comment_id   |String| id of the Comment

**NOTE** Either of these id values must be present. Both cannot be empty.
```

- Sample API Call

```
curl --location 'http://localhost:3000/api/getComments?post_id=20783694-598d-475d-8390-6da6f3e44390'
```

- Response

```
[
    {
        "id": "bdb60268-943c-4195-bd8b-cf0f39809269",
        "post_id": "20783694-598d-475d-8390-6da6f3e44390",
        "parent_comment_id": null,
        "body": "Why first comment?",
        "level": 1,
        "children": [
            {
                "id": "07402a58-4126-49d1-95b5-1575bd4852b5",
                "post_id": null,
                "parent_comment_id": "bdb60268-943c-4195-bd8b-cf0f39809269",
                "body": "It has to be the first comment",
                "level": 2,
                "children": [
                    {
                        "id": "db0c3ccd-042b-404c-a198-b37909e83dce",
                        "post_id": null,
                        "parent_comment_id": "07402a58-4126-49d1-95b5-1575bd4852b5",
                        "body": "I don't agree, I think this can't be the first comment",
                        "level": 3,
                        "children": []
                    }
                ]
            },
            {
                "id": "0b58e46d-5d86-4396-84ba-0d963b7d0507",
                "post_id": null,
                "parent_comment_id": "bdb60268-943c-4195-bd8b-cf0f39809269",
                "body": "This is the second comment.",
                "level": 2,
                "children": []
            }
        ]
    }
]
```
