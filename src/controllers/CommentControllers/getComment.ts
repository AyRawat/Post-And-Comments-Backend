import db from "db";
import { IGetCommentDto } from "../../interfaces/Comments/IComments";

function buildCommentTree(comments: any[]) {
  if (comments.length == 1) return comments;
  const commentMap: any = {};
  const rootComments: any[] = [];

  comments.forEach((comment) => {
    comment.children = [];
    commentMap[comment.id] = comment;
  });

  comments.forEach((comment) => {
    if (comment.parent_comment_id !== null) {
      const parentComment = commentMap[comment.parent_comment_id];
      if (parentComment) {
        parentComment.children.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}
export const getCommentsData = async (data: IGetCommentDto) => {
  let query: string = "";
  let values: [string | null] = [null];
  let { post_id, comment_id } = data;
  if (post_id) {
    query = `WITH RECURSIVE comment_tree AS (
        SELECT id, post_id, parent_comment_id, body, 1 AS level
        FROM comments
        WHERE post_id = $1 AND parent_comment_id IS NULL -- level 1 comments for the given post_id
        UNION ALL
        SELECT c.id, c.post_id, c.parent_comment_id, c.body, ct.level + 1 AS level
        FROM comments c
        INNER JOIN comment_tree ct ON c.parent_comment_id = ct.id -- level 2 comments on level 1 comments
      )
      SELECT id, post_id, parent_comment_id, body, level
      FROM comment_tree Where level <= 3
      ORDER BY level, id;`;
  }
  values = [post_id];
  if (comment_id) {
    query = `WITH RECURSIVE comment_thread AS (
        SELECT id, post_id, parent_comment_id, body, 1 as level
        FROM comments
        WHERE id = $1
        UNION ALL
        SELECT c.id, c.post_id, c.parent_comment_id, c.body, ct.level + 1
        FROM comments c
        JOIN comment_thread ct ON c.parent_comment_id = ct.id
      )
      SELECT * , level
      FROM comment_thread`;
    values = [comment_id];
  }
  return new Promise((resolve, reject) => {
    db.pool.query(query, values, (err, result) => {
      if (err) {
        let message = {
          message: "Failed to fetch the results",
          error: JSON.parse(JSON.stringify(err.message)),
        };
        reject(message);
      }
      let data = buildCommentTree(result?.rows);
      resolve(data);
    });
  });
};
