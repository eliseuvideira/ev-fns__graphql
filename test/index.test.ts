import { resolver } from "../src/functions/resolver";
import { subscription } from "../src/functions/subscription";

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
