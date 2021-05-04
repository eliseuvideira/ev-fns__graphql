import { ExpressContext } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";

export interface Context extends ExpressContext {
  pubsub: PubSub;
}
