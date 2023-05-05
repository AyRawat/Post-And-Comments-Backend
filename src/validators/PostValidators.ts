import { body } from "express-validator";

export const postCommentValidationRules = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title cannot be empty")
      .isLength({ max: 30 })
      .withMessage("Title must not exceed 30 characters"),
    body("description")
      .notEmpty()
      .withMessage("Description cannot be empty")
      .isLength({ max: 500 })
      .withMessage("Description must not exceed 500 characters"),
  ];
};
