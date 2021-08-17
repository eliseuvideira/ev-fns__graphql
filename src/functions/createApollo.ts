import {
  ApolloServer,
  ApolloServerExpressConfig,
  Config,
  ExpressContext,
} from "apollo-server-express";
import { createGraphqlUpload } from "./createGraphqlUpload";
import { typeDefs as rootTypeDefs } from "../typeDefs/root";
import { DocumentNode } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { IResolvers } from "@graphql-tools/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { UploadOptions } from "graphql-upload";
import { createContext } from "./createContext";
import { ContextFunction } from "apollo-server-core";
import { createFormatError } from "./createFormatError";
import { createSubscriptions } from "./createSubscriptions";

export type CreateApolloBaseProps = Omit<
  Omit<Omit<ApolloServerExpressConfig, "typeDefs">, "resolvers">,
  "context"
>;

export interface CreateApolloProps<T extends ExpressContext>
  extends CreateApolloBaseProps,
    UploadOptions {
  resolvers: IResolvers[];
  typeDefs: DocumentNode[];
  context: Record<string, any> | ContextFunction<T>;
  cors?: boolean;
}

export const createApollo = <T extends ExpressContext>({
  typeDefs: _typeDefs,
  resolvers: _resolvers,
  context: _context = {},
  formatError: _formatError,
  introspection: _introspection,
  maxFieldSize,
  maxFileSize,
  maxFiles,
  cors = true,
  ...configProps
}: CreateApolloProps<T>) => {
  const pubsub = new PubSub();

  const typeDefs = [rootTypeDefs, ..._typeDefs];

  const resolvers = [..._resolvers];

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const context = createContext(_context, pubsub);

  const formatError = createFormatError(_formatError);

  const introspection =
    _introspection != null
      ? process.env.NODE_ENV !== "production"
      : _introspection;

  const config: Config<ExpressContext> = {
    schema,
    context,
    formatError,
    introspection,
    ...configProps,
  };

  const apolloServer = new ApolloServer(config);

  const middleware = apolloServer.getMiddleware({ cors });

  const upload = createGraphqlUpload({
    maxFieldSize,
    maxFileSize,
    maxFiles,
  });

  const subscriptions = createSubscriptions(apolloServer);

  return { middleware, upload, subscriptions };
};
