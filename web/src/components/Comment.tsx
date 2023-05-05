import clsx from 'clsx';
import Image from 'next/image';

interface Comment {
  body: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  rating: number;
}

interface CommentProps {
  className?: string;
  children?: React.ReactNode;
  comment: Comment;
}

const Comment = ({ className, children, comment }: CommentProps) => { 
  const rootClassName = clsx(className, 'flex flex-col space-y-2 p-2 border border-slate-800 rounded-md');

  const { body, authorName, authorAvatar, createdAt, rating } = comment;

  return (
    <div className={rootClassName}>
      <div className="flex space-x-2">
        <div className="w-8 h-8 rounded-full overflow-hidden">
         <Image src={authorAvatar} alt={authorName} width={32} height={32} /> 
        </div>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold">{authorName}</span>
            <span className="text-xs text-gray-500">{createdAt}</span>
          </div>
          <p className="text-sm">{body}</p>
          <p>{rating}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Comment;
