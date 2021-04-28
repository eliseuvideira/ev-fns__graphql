import { PubSub, PubSubOptions } from "graphql-subscriptions";

export const createPubSub = (options?: PubSubOptions) => new PubSub(options);
