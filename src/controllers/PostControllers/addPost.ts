import db from "db";
import {
  IPostDto,
  IPostResultDto,
  IPostError,
} from "../../interfaces/Posts/IPosts";

const dbHandler = async (
  query: string,
  values: [string, string]
): Promise<IPostResultDto> => {
  return new Promise((resolve, reject) => {
    db.pool.query(query, values, (err, result) => {
      if (err) {
        reject(new Error(err.message));
      }
      resolve(JSON.parse(JSON.stringify(result?.rows[0])));
    });
  });
};

export const addPost = async (
  post: IPostDto
): Promise<IPostResultDto | IPostError> => {
  let { title, description } = post;
  const query: string = `INSERT INTO posts (title, description) VALUES($1, $2) RETURNING *`;
  const values: [string, string] = [title, description];
  try {
    let saved_post: IPostResultDto = await dbHandler(query, values);
    return saved_post;
  } catch (error) {
    console.log("There is an error while saving to file", error);
    let errorVal: IPostError = {
      message: "Failed to add the Post",
      error: JSON.stringify(error),
    };
    return errorVal;
  }
};
