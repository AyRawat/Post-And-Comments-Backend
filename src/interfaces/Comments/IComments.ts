export interface ICommentDto {
  post_id: string | null;
  parent_comment_id: string | null;
  text: string;
}

export interface IGetCommentDto {
  post_id: string | null;
  comment_id: string | null;
}

export interface ICommentResultDto {
  id: string;
  body: string;
  post_id: string | null;
  parent_comment_id: string | null;
  created_at: string;
}

export interface ICommentError {
  message: string;
  error: string;
}

export interface ICommentsResultDB {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  created_at: string;
  body: string;
}

// {
//   id: 'e8aa1ba6-2a08-4984-9376-619eb62b1672',
//   post_id: '78458d70-a7fc-4287-b0b3-fb659d5162e6',
//   parent_comment_id: null,
//   body: 'This is the 1st comment on 3rd Post.',
//   created_at: 2023-05-04T22:13:01.634Z
// }
