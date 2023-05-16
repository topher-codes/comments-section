'use client'
import clsx from 'clsx';
import {useState, useRef, useEffect} from 'react';
import {api} from '~/utils/api';
import {useRouter} from 'next/router';
import { useSession } from 'next-auth/react';

interface InputProps {
  className?: string;
  isReply?: boolean;
  parentId?: string;
  parentAuthorName?: string;
}

const Input = ({ className, isReply, parentId, parentAuthorName }: InputProps) => {
  const rootClassName = clsx(className, 'flex p-4 border border-slate-800 bg-white rounded-md my-2 w-full items-center justify-between');
  // Grab the session data. We will use this to get the authorId of the comment.
  const { data: session } = useSession();
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Grab the router so we can reload the page after the comment is created.
  const router = useRouter();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // Focus on the input when the component is mounted
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Create the comment
  const createComment = api.comments.createComment.useMutation();
  const sendComment = () => {
    if (value.length === 0) {
      return;
    }
    let mention = value;
    if (isReply) {
      mention = `@${parentAuthorName} ${value}`;
    }
    createComment.mutate({
      comment: {
        body: mention,
        authorId: session?.user?.id as string,
        isReply: isReply,
        parentId: parentId,
      }
    });
    router.reload();
  }




  return (
    <div className={rootClassName}> 
      <input ref={inputRef} value={value} onChange={onChange} className="w-full h-8 border text-xs" placeholder='Add a comment...' />
      {/* button should be aligned all the way to the right, or at the end of the flexbox */}
      <div className="flex-grow" />
      <button className="border border-slate-800 rounded-md px-2 py-1 justify-end" onClick={() => {
        sendComment();
        setValue('');
      }}>Post</button>
    </div>

  )
};

export default Input;
