import { test, expect } from "vitest";
import { orderTotal } from "../../src/orders/price.js";

test("adds price times quantity for every item", () => {
    const items = [{ name: "dosa", price: 60, qty: 2 }, { name: "chai", price: 15, qty: 1 }];
    expect(orderTotal(items)).toBe(135);
});

test("an empty order costs nothing", () => {
    expect(orderTotal([])).toBe(0);
});
