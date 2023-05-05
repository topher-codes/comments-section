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
        body: z.string(),
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
        },
      })
    }),

    getComments: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.comment.findMany()
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



