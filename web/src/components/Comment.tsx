'use client'
import clsx from 'clsx';
import Image from 'next/image';
import { api } from '~/utils/api';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Input from './Input';

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
  const { votes, body, createdAt, authorId, isReply } = comment;
  let { id, parentId } = comment;
  const { data: author } = api.comments.getAuthor.useQuery(authorId);
  const { data: session } = useSession();

  const [typing, setTyping] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string>(body);

  const inputRef = useRef<HTMLInputElement>(null);

  const vote = api.comments.voteComment.useMutation();
  const deleteComment = api.comments.deleteComment.useMutation();
  const editComment = api.comments.updateComment.useMutation();
  
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

  // Function "reply" simply toggles the typing state. 
  const reply = () => {
    setTyping(!typing);
  }

  if (isReply) {
    id = parentId;
  }

  const deleteTheComment = (id: string) => {
    deleteComment.mutate({
      id: id,
    });
    router.reload();
  }

  const editTheComment = (id: string) => {
    editComment.mutate({
      comment: {
        id: id,
        body: value,
      },
    });

    router.reload();
  }

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);



  return (
    <div className={rootClassName}>
      <div className="flex w-full ">
        <div className="flex space-x-20 w-full ">
          <div className="flex flex-col items-center">
            <button className="text-sm" onClick={upvote(id)}><Image src={"/arrow-up.svg"} alt="up" width={30} height={30} /></button>
            <p>{rating.rating}</p>
            <button className="text-sm" onClick={downvote(id)}><Image src={"/arrow-down.svg"} alt="up" width={30} height={30} /></button>
          </div>
          <div className="flex flex-col w-full ">
          <div className="flex items-center mx-2">
            <Image src={author?.image} width={20} alt="img" height={20} className="rounded-full" />
            <span className="text-sm text-gray-500 mx-1">{author?.name}</span>
            <span className="text-sm text-gray-500 mx-1">{createdAt.toLocaleDateString()}</span>
          </div>
          {!editing ? (
            <p>{body}</p>
          ) : (
          <div className="flex flex-row">
            <input className="w-full" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} />
            <button className="text-sm p-2 border border-black rounded-md" onClick={() => editTheComment(comment.id)}>Update</button>
          </div>
          )}
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            {session?.user?.id === authorId && ( 
            <>
              <div className="flex flex-row">
              <button className="text-sm py-4 mx-1" onClick={() => setEditing(!editing)}><Image src={"/edit.svg"} alt="edit" width={20} height={20} /></button>
              <button className="text-sm py-4 mx-1" onClick={() => deleteTheComment(comment.id)}><Image src={"/trash-2.svg"} alt="delete" width={20} height={20} /></button>
              </div>
              <button className="text-sm px-4 mx-4" onClick={reply}>Reply</button>
            </>
            )}
          </div>
        </div>
      </div>
      {
        typing && (
          <Input className="w-full" isReply={true} parentId={id} /> 
        )
      }
      {children}
    </div>
  );
};

export default Comment;
