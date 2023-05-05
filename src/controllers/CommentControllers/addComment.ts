import db from "db";
import {
  ICommentDto,
  ICommentResultDto,
  ICommentsResultDB,
  ICommentError,
} from "../../interfaces/Comments/IComments";

const dbHandler = async (
  query: string,
  values: [string | null, string | null]
): Promise<ICommentResultDto> => {
  return new Promise((resolve, reject) => {
    db.pool.query(query, values, (err, result) => {
      if (err) {
        reject(new Error(err.message));
      }
      resolve(JSON.parse(JSON.stringify(result?.rows[0])));
    });
  });
};

export const addComment = async (
  comment: ICommentDto
): Promise<ICommentResultDto | ICommentError> => {
  let { post_id, parent_comment_id, text } = comment;
  let query: string = "";
  let values: [string | null, string | null] = [null, null];
  if (post_id) {
    query = `INSERT INTO comments (post_id, body) VALUES ($1, $2) RETURNING *`;
    values = [post_id, text];
  }
  if (parent_comment_id) {
    query = `INSERT INTO comments (parent_comment_id, body) VALUES ($1, $2) RETURNING *`;
    values = [parent_comment_id, text];
  }
  try {
    let savedComment: ICommentResultDto = await dbHandler(query, values);
    return savedComment;
  } catch (error) {
    console.log("Failed while saving the comment", error);
    let errorVal: ICommentError = {
      message: "Failed to add the comment",
      error: JSON.stringify(error),
    };
    return errorVal;
  }
};
