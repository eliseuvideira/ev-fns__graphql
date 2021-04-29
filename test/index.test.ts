const pubsub = {};
const getMiddleware = jest.fn();
const installSubscriptionHandlers = jest.fn();
const createApolloServer = jest.fn(() => ({
  getMiddleware,
  installSubscriptionHandlers,
}));
const createPubSub = jest.fn(() => pubsub);

jest.mock("../src/functions/createApolloServer", () => ({
  createApolloServer,
}));
jest.mock("../src/functions/createPubSub", () => ({
  createPubSub,
}));

import { resolver } from "../src/functions/resolver";
import { subscription } from "../src/functions/subscription";
import { createApollo } from "../src/functions/createApollo";

describe("resolver", () => {
  it("creates a resolver function", async () => {
    expect.assertions(2);

    const fn = jest.fn();

    const res = resolver(fn) as any;

    const args = [{}, {}, {}];

    await res(...args);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(...args);
  });
});

describe("subscription", () => {
  it("creates a subscription function", async () => {
    expect.assertions(4);

    const fn = jest.fn();

    const sub = subscription(fn) as any;

    expect(sub).toBeDefined();
    expect(sub.subscribe).toEqual(fn);

    const args = [{}, {}, {}];

    await sub.subscribe(...args);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(...args);
  });
});

describe("createApollo", () => {
  it("works", async () => {
    expect.assertions(9);

    const contextFn = jest.fn();

    const apollo = createApollo({
      typeDefs: {} as any,
      resolvers: {} as any,
      context: contextFn,
    });

    expect(createApolloServer).toHaveBeenCalledTimes(1);
    expect(getMiddleware).toHaveBeenCalledTimes(1);
    expect(createPubSub).toHaveBeenCalledTimes(1);

    const server = {} as any;

    apollo.installSubscriptions(server);

    expect(installSubscriptionHandlers).toHaveBeenCalledTimes(1);
    expect(installSubscriptionHandlers).toHaveBeenCalledWith(server);

    const [{ context }] = createApolloServer.mock.calls[0] as any;

    const args = { anyKey: "anyValue" };

    const ctx = await context(args);

    expect(contextFn).toHaveBeenCalledTimes(1);
    expect(contextFn).toHaveBeenCalledWith(args);
    expect(ctx).toBeDefined();
    expect(ctx.pubsub).toBe(pubsub);
  });

  it("works for context as object", async () => {
    expect.assertions(5);

    {
      const contextProp = {};
      const contextObj = { contextProp };

      createApollo({
        typeDefs: {} as any,
        resolvers: {} as any,
        context: contextObj,
      });

      const [{ context }] = createApolloServer.mock.calls[1] as any;

      const ctx = await context();

      expect(ctx).toBeDefined();
      expect(ctx.pubsub).toBe(pubsub);
      expect(ctx.contextProp).toBe(contextProp);
    }

    {
      createApollo({
        typeDefs: {} as any,
        resolvers: {} as any,
      });

      const [{ context }] = createApolloServer.mock.calls[1] as any;

      const ctx = await context();

      expect(ctx).toBeDefined();
      expect(ctx.pubsub).toBe(pubsub);
    }
  });
});
