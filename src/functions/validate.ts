import { ValidationError } from "apollo-server-errors";
import { ObjectSchema } from "joi";
import { Context } from "../types/Context";
import { resolver, ResolverFn } from "./resolver";

export const validate = <
  Parent = any,
  Args = any,
  Ctx extends Context = Context,
  Result = any
>(
  resolv: ResolverFn<Parent, Args, Ctx, Result>,
  schema: ObjectSchema,
) =>
  resolver<Parent, Args, Ctx, Result>(async (parent, args, ctx, ...rest) => {
    let value;
    try {
      value = await schema.validateAsync(args);
    } catch (err) {
      throw new ValidationError(err.message);
    }
    return resolv(parent, value, ctx, ...rest);
  });
