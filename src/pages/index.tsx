import { type NextPage } from "next";
import Head from "next/head";
import CommentContainer from "~/components/Comment";
import { api } from "~/utils/api";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { Comment } from "@prisma/client";
import Input from "~/components/Input";


const Home: NextPage = () => {
  // Grab the session data from next-auth
  const { data: session } = useSession();

  // Grab the router so that we can reload the page after we generate a response
  const router = useRouter();

  // Grab the trpc query that fetches all of the comments (includes replies)
  const getComments = api.comments.getComments.useQuery();

  // Store the result of getComments in an array of comments
  // We will be adding to this with some ai responses later
  const comments: Comment[] = getComments.data || [];

  // Loop through the comments and find the comments that don't have a parent and don't have any replies
  // These are the comments that we will generate ai responses for.
  const randomAIUserResponse = api.users.getRandomAIUser.useQuery();
  const { data: randomAIUser } = randomAIUserResponse;
  const createUser = api.users.createUser.useMutation();
  const userCreate = () => {
    createUser.mutate({
      name: "John Doe",
      email: "test@email.com"
    })
  }


  return (
    <>
      <Head>
        <title>Comments Section</title>
        <meta name="description" content="Created by topher-codes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className="flex flex-col h-screen mx-20   overflow-y-auto scrollbar-hide" >
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
        {comments.map((comment) => (
          !comment.isReply &&
          <CommentContainer key={comment.id} comment={comment} >
            {comment.replies?.map((reply) => (
            <CommentContainer key={reply.id} comment={reply} />
            ))}
            {/* Put the ai generated responses here in another comment container */}

          </CommentContainer>
        ))}
        {/* */}
        {/* If the user is signed in, show the Input component so that they can post a comment */}
        {session && (
          <Input />
        )}
        <div id="modal" />

      </main>

    </>
  );
};

export default Home;
