import express, { Request, Response } from "express";
import { addPost } from "../controllers/PostControllers/addPost";
import { getPosts } from "../controllers/PostControllers/getPost";
import { addComment } from "../controllers/CommentControllers/addComment";
import { getCommentsData } from "../controllers/CommentControllers/getComment";
import {
  IGetCommentDto,
  ICommentResultDto,
  ICommentError,
} from "interfaces/Comments/IComments";
import { IPostResultDto, IPostError } from "interfaces/Posts/IPosts";
import { postCommentValidationRules } from "validators/PostValidators";
import { commentValidationRules } from "validators/CommentValidators";
import { validationResult } from "express-validator";
export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("HEllo World");
});

//Routes for Posts
router.post(
  "/addPost",
  postCommentValidationRules(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        mesage:
          "Please check the body, 'title' and 'description' are required fields",
        errors: errors.array(),
      });
    }
    try {
      let savePost: IPostResultDto | IPostError = await addPost(req.body);
      if ("error" in savePost) {
        throw savePost;
      }
      let posts = await getPosts();
      return res.status(200).json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).send({ err: error });
    }
  }
);
router.get("/getPosts", async (req: Request, res: Response) => {
  try {
    let result = await getPosts();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).send({
      err: error,
    });
  }
});

//Routes for Comments
router.post(
  "/addComment",
  commentValidationRules(),
  async (req: Request, res: Response) => {
    let { parent_comment_id, post_id } = req.body;
    const errors = validationResult(req);
    if (!parent_comment_id && !post_id) {
      return res.status(400).json({
        error:
          "post_id and comment_id both are missing. At least one of them is required",
      });
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({
        mesage:
          "Please check the body, 'title' and 'description' are required fields",
        errors: errors.array(),
      });
    }
    try {
      let saveComment: ICommentResultDto | ICommentError = await addComment(
        req.body
      );
      if ("error" in saveComment) {
        throw saveComment;
      }
      let getCommentDetail: IGetCommentDto = {
        post_id: saveComment?.post_id || null,
        comment_id: saveComment?.id || null,
      };
      let comments;
      if (getCommentDetail.post_id) {
        comments = await getCommentsData(getCommentDetail);
      } else {
        comments = saveComment;
      }

      return res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res.sendStatus(500).send({ err: error });
    }
  }
);
router.get("/getComments", async (req: Request, res: Response) => {
  let { post_id, comment_id } = req.query;

  if (!comment_id && !post_id) {
    return res.status(400).json({
      error:
        "post_id and comment_id both are missing. At least one of them is required",
    });
  }
  try {
    const data: IGetCommentDto = {
      post_id: (req.query.post_id as string) || null,
      comment_id: (req.query.comment_id as string) || null,
    };
    let comments = await getCommentsData(data);
    res.status(200).send(comments);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      err: error,
    });
  }
});
