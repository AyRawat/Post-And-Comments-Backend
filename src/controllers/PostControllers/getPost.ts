import db from "db";

export const getPosts = async () => {
  let query: string = `Select p.id, p.title, p.description,p.created_at, c.body as Comments from posts AS p Left join comments as c ON p.id=c.post_id Order by p.created_at`;
  return new Promise((resolve, reject) => {
    db.pool.query(query, (err, result) => {
      if (err) {
        let message = {
          message: "Failed to fetch the results",
          error: JSON.parse(JSON.stringify(err.message)),
        };
        reject(message);
      }
      resolve(result?.rows);
    });
  });
};
