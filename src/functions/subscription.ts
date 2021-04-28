import { Context } from "../types/Context";

export const subscription = <
  Parent = any,
  Args = any,
  Ctx extends Context = Context,
  Result extends AsyncIterator<any> = AsyncIterator<any>
>(
  fn: (parent: Parent, args: Args, context: Ctx) => Promise<Result>,
) => ({ subscribe: fn });
