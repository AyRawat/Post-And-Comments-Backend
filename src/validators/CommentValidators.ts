import { body } from "express-validator";

export const commentValidationRules = () => {
  return [
    body("text").notEmpty().withMessage("Comment text is required"),
    body("post_id").optional().notEmpty().withMessage("Post ID is required"),
    body("parent_comment_id")
      .optional()
      .notEmpty()
      .withMessage("Comment ID is required"),
  ];
};
