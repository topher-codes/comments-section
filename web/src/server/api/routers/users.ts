import {z } from 'zod';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  createUser: protectedProcedure
  .input(z.object({
    name: z.string(),
    email: z.string().email(),
  }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        image: "/image-maxblagun.webp",
      },
    });
  }),

  getRandomAIUser: protectedProcedure
  .query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        email: {
          contains: "test@email.com"
        }
      }
    });
  }),

});
