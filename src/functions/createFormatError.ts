import { GraphQLError, GraphQLFormattedError } from "graphql";

export const createFormatError =
  (
    _formatError?: (
      error: GraphQLError,
    ) => GraphQLFormattedError<Record<string, any>>,
  ) =>
  (err: GraphQLError) => {
    if (
      err.originalError &&
      err.extensions &&
      err.extensions.code === "INTERNAL_SERVER_ERROR"
    ) {
      console.error(err);
      console.error(err.originalError);
      if (process.env.NODE_ENV === "production") {
        err.message = "Internal server error";
      }
    }

    if (_formatError) {
      return _formatError(err);
    }

    return err;
  };
