type UserObj = {
  id: string;
  name: string;
};

type CommentObj = {
  id: string;
  message: string;
  parentId: string | null;
  createdAt: string;
  user: UserObj;
};

type PostObj = { title: string; body: string };
