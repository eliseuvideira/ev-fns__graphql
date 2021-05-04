import { Context } from "../types/Context";

export type ResolverFn<
  Parent = any,
  Args = any,
  Ctx extends Context = Context,
  Result = any
> = (parent: Parent, args: Args, context: Ctx) => Promise<Result>;

export const resolver = <
  Parent = any,
  Args = any,
  Ctx extends Context = Context,
  Result = any
>(
  fn: ResolverFn<Parent, Args, Ctx, Result>,
) => fn;
