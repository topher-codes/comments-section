'use client'
import clsx from 'clsx';
import Image from 'next/image';
import { api } from '~/utils/api';
import { useState } from 'react';

interface Comment {
  id: string;
  body: string;
  authorId: string;
  createdAt: Date;
  rating: number;
  isReply: boolean;
  parentId: string;
}

interface CommentProps {
  className?: string;
  children?: React.ReactNode;
  comment: Comment;
}

const Comment = ({ className, children, comment }: CommentProps) => { 
  const rootClassName = clsx(className, 'flex flex-col space-y-2 p-2 border border-slate-800 rounded-md my-2 w-full');
  const { body, createdAt, rating, authorId, isReply, parentId } = comment;
  const { data: author } = api.comments.getAuthor.useQuery(authorId);
  let id = comment.id;

  const createComment = api.comments.createComment.useMutation();

  if (isReply) {
    id = parentId
    }

  const postReply = (parentId: string) => () => {
    createComment.mutate({
      comment: {
        body: "This is a reply",
        authorId: author?.id,
        parentId: parentId,
        isReply: true,
      },
    });
  };

  return (
    <div className={rootClassName}>
      <div className="flex space-x-20 w-full ">
        <div className="flex space-x-20">
          <div className="flex flex-col items-center">
            <button className="text-sm"><Image src={"/arrow-up.svg"} alt="up" width={30} height={30} /></button>
            <p>{rating}</p>
            <button className="text-sm"><Image src={"/arrow-down.svg"} alt="up" width={30} height={30} /></button>
          </div>
          <div className="flex flex-col">
          <div className="flex items-center mx-2">
            <Image src={author?.image} width={20} alt="img" height={20} className="rounded-full" />
            <span className="text-xs text-gray-500 mx-1">{author?.name}</span>
            <span className="text-xs text-gray-500 mx-1">{createdAt.toLocaleDateString()}</span>
          </div>
            <p className="text-sm">{body}</p>
          </div>
        </div>
        <div className="flex w-full justify-end">
        <button className="text-sm px-4 mx-4" onClick={postReply(id)}>Reply</button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Comment;
