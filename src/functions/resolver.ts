import { Context } from "../types/Context";

export const resolver = <
  Parent = any,
  Args = any,
  Ctx extends Context = Context,
  Result = any
>(
  fn: (parent: Parent, args: Args, context: Ctx) => Promise<Result>,
) => fn;
