'use client'
import clsx from 'clsx';
import Image from 'next/image';
import { api } from '~/utils/api';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface Comment {
  id: string;
  body: string;
  authorId: string;
  createdAt: Date;
  rating: number;
  isReply: boolean;
  parentId: string;
  votes: [];
}

interface CommentProps {
  className?: string;
  children?: React.ReactNode;
  comment: Comment;
}

const Comment = ({ className, children, comment }: CommentProps) => { 
  const router = useRouter();
  const rootClassName = clsx(className, 'flex flex-col space-y-2 p-2 border border-slate-800 rounded-md my-2 w-full');
  const { votes, body, createdAt, authorId, isReply, id } = comment;
  const { data: author } = api.comments.getAuthor.useQuery(authorId);

  const createComment = api.comments.createComment.useMutation();
  const vote = api.comments.voteComment.useMutation();
  
  // Define the rating of the comment. The rating is the number of upvotes minus the number of downvotes.
  const rating = { rating: 0 };
  if (votes) {
    votes.forEach((vote: any) => {
      if (vote.type === "up") {
        rating.rating += 1;
      } else {
        rating.rating -= 1;
      }
    })
  }


  // Handle the upvote and downvote
  const upvote = (commentId: string) => () => {
    if (votes?.some((vote: any) => vote.authorId === author?.id)) {
      return;
    }
    vote.mutate({
      commentId: commentId,
      authorId: author?.id,
      type: "up",
    });

    router.reload();

  }

  const downvote = (commentId: string) => () => {
    if (votes?.some((vote: any) => vote.authorId === author?.id)) {
      return;
    }
    vote.mutate({
      commentId: commentId,
      authorId: author?.id,
      type: "down",
    });

    router.reload();
  }


  

  // Create a reply comment. If the current comment is at the top level (doesn't have a parent), then the reply
  // comment will have the current comment as its parent. If the current comment is a reply, then the reply comment
  // will have the same parent as the current comment.
  const postReply = (parentId: string) => () => {
    createComment.mutate({
      comment: {
        body: "This is a reply",
        authorId: author?.id,
        parentId: parentId,
        isReply: true,
      },
    });

    router.reload();
  };

  return (
    <div className={rootClassName}>
      <div className="flex space-x-20 w-full ">
        <div className="flex space-x-20">
          <div className="flex flex-col items-center">
            <button className="text-sm" onClick={upvote(id)}><Image src={"/arrow-up.svg"} alt="up" width={30} height={30} /></button>
            <p>{rating.rating}</p>
            <button className="text-sm" onClick={downvote(id)}><Image src={"/arrow-down.svg"} alt="up" width={30} height={30} /></button>
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
