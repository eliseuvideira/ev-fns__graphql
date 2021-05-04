import { ValidationError } from "apollo-server-errors";
import { ResolverFn } from "graphql-subscriptions";
import { ObjectSchema } from "joi";
import { resolver } from "./resolver";

export const validate = (resolv: ResolverFn, schema: ObjectSchema) =>
  resolver(async (parent, args, ctx, ...rest) => {
    let value;
    try {
      value = await schema.validateAsync(args);
    } catch (err) {
      throw new ValidationError(err.message);
    }
    resolv(parent, value, ctx, ...rest);
  });
