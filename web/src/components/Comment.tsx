import clsx from 'clsx';

interface CommentProps {
  className?: string;
  children?: React.ReactNode;
  body: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  rating: number;
}

const Comment = ({ className, children, body, authorName, authorAvatar, createdAt }: CommentProps) => { 
  const rootClassName = clsx(className, 'flex flex-col space-y-2');

  return (
    <div className={rootClassName}>
      <div className="flex space-x-2">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src={authorAvatar} alt={authorName} />
        </div>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold">{authorName}</span>
            <span className="text-xs text-gray-500">{createdAt}</span>
          </div>
          <p className="text-sm">{body}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Comment;
