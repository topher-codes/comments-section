import { type NextPage } from "next";
import Head from "next/head";
import Comment from "~/components/Comment";
import { api } from "~/utils/api";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();


  //TODO : move this to a component
  const createComment = api.comments.createComment.useMutation();
  const postComment = () => {
    createComment.mutate({
      comment: {
        body: "This is a comment",
        authorId: session?.user?.id || "",
      },
    });
  };

  const getComments = api.comments.getComments.useQuery();
  



  return (
    <>
      <Head>
        <title>Comments Section</title>
        <meta name="description" content="Created by topher-codes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col min-h-screen mx-20  items-center justify-center" >
      <div className="flex my-2 p-4">
        <h1>Comments Section</h1>
        {session ? (
          <button className="border border-black px-4 mx-4" onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button className="border border-black px-4 mx-4" onClick={() => signIn()}>Sign In</button>
        )}
        <button className="border border-black px-4 mx-4" onClick={() => postComment()}>Post Comment</button>
      </div>
        {getComments.data?.map((comment) => (
          <Comment key={comment.id} comment={comment} className="w-full" />
        ))}


      </main>

    </>
  );
};

export default Home;
