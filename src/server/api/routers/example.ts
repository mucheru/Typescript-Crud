import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;


const idSchema = z.object({ id: z.string() });

const userSchema = z.object({
  name: z.string(),
  email: z.string(),
});

const userUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export const exampleRouter = createTRPCRouter({
  //get all users
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  //get user by id
  getOne: publicProcedure
    .input(idSchema)
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({
        where: idSchema.parse(input),
      });
    }),

  //create user
  createUser: publicProcedure
    .input(userSchema)
    .mutation(({ input, ctx }) => {
      return ctx.db.user.create({
        data: userSchema.parse(input),
      });
    }),

  //update user
  updateUser: publicProcedure
    .input(userUpdateSchema)
    .mutation(({ input, ctx }) => {
      return ctx.db.user.update({
        where: {
          id: input.id.toString(),
        },
        data: userUpdateSchema.parse(input),
      });
    }),

  //delete user
  deleteUser: publicProcedure
    .input(idSchema)
    .mutation(({ input, ctx }) => {
      return ctx.db.user.delete({
        where: idSchema.parse(input),
      });
    }),
});