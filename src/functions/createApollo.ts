import { DocumentNode } from "graphql";
import { IResolvers, ExpressContext } from "apollo-server-express";
import { Server } from "http";
import { createApolloServer } from "./createApolloServer";
import { createPubSub } from "./createPubSub";

interface CreateApolloProps {
  typeDefs: DocumentNode[];
  resolvers: IResolvers<any, any>[];
  context: (ctx: ExpressContext) => Record<string, any>;
}

export const createApollo = ({
  typeDefs,
  resolvers,
  context,
}: CreateApolloProps) => {
  const pubsub = createPubSub();

  const apolloServer = createApolloServer({
    typeDefs,
    resolvers,
    context: async (...args) => {
      const ctx = await context(...args);
      return { ...ctx, pubsub };
    },
    uploads: true,
    introspection: true,
    playground: true,
  });

  const middleware = apolloServer.getMiddleware();

  const installSubscriptions = (server: Server) =>
    apolloServer.installSubscriptionHandlers(server);

  return { middleware, installSubscriptions };
};
