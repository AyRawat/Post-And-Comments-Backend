import { ICommentDto } from "../Comments/IComments";
export interface IPostDto {
  title: string;
  description: string;
}

export interface IPostResult extends IPostDto {
  id: string;
  creationDate: Date;
  comments: Array<ICommentDto>;
}

export interface IPostResultDto extends IPostDto {
  id: string;
  created_at: string;
  comments: string;
}

export interface IPostError {
  message: string;
  error: string;
}
