import {z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";



export const commentsRouter = createTRPCRouter({
  // createComment takes a comment (found in prisma schema) and updates the database
  // with the new comment. It returns the comment that was created.

  createComment: publicProcedure
    .input(z.object({
      comment: z.object({
        body: z.string().max(150),
        authorId: z.string(),
        parentId: z.string().optional(),
        isReply: z.boolean().optional(),
      }),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          body: input.comment.body,
          authorId: input.comment.authorId,
          parentId: input.comment.parentId,
          isReply: input.comment.isReply,
        },
      })
    }),

    // updateComment takes a comment (found in prisma schema) and updates the database
    // with the new comment. It returns the comment that was updated.
    updateComment: publicProcedure
    .input(z.object({
      comment: z.object({
        id: z.string(),
        body: z.string().max(150),
      }),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.update({
        where: {
          id: input.comment.id,
        },
        data: {
          body: input.comment.body,
        },
      })
    }),


    // deleteComment takes a comment (found in prisma schema) and deletes the comment from the database.
    // It returns the comment that was deleted.
    deleteComment: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      })
    }),

    getComments: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.comment.findMany({
        include: {
          replies: true,
          votes: true,
        },
    })
  }),
    
    voteComment: publicProcedure
    .input(z.object({
      commentId: z.string(),
      authorId: z.string(),
      type: z.string(),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.vote.create({
        data: {
          commentId: input.commentId,
          authorId: input.authorId,
          type: input.type,
        },
      })
    }),


    getAuthor: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input,
        },
      })
    }),
}); 



