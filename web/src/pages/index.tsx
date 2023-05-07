import { type NextPage } from "next";
import Head from "next/head";
import Comment from "~/components/Comment";
import { api } from "~/utils/api";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  // Grab the session data from next-auth
  const { data: session } = useSession();

  // Grab the trpc query that fetches all of the comments (includes replies)
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

        {/* If the user is signed in, show the sign out button. Otherwise, show the sign in button. */}
        {session ? (
          <button className="border border-black px-4 mx-4" onClick={() => signOut()}>Sign Out</button>
        ) : (
          <button className="border border-black px-4 mx-4" onClick={() => signIn()}>Sign In</button>
        )}
        {/* */}
      </div>

        {/* Loop through the comments and render them. If the comment contains replies, render those as children */}
        {getComments.data?.map((comment) => (
          !comment.isReply &&
          <Comment key={comment.id} comment={comment} className="w-full" >
            {comment.replies?.map((reply) => (
              <Comment key={reply.id} comment={reply} className="w-full" />
            ))}
          </Comment>
        ))}
        {/* */}


      </main>

    </>
  );
};

export default Home;
