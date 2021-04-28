export const resolver = <Parent = any, Args = any, Context = any, Result = any>(
  fn: (parent: Parent, args: Args, context: Context) => Promise<Result>,
) => fn;
