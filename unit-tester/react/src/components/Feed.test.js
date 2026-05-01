import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import Feed from "./Feed";
import EvincedUT from "@evinced/unit-tester";

// this example creates a dummy feed, more info on what actually is a feed: https://www.w3.org/html/wg/wiki/Feed.html

jest.mock("@evinced/unit-tester", () => ({
  analyzeFeed: jest.fn(),
}));

describe("Feed Component", () => {
  const mockFeedUrl = "https://mock-feed-url.com/feed";

  it("renders feed items correctly", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              { title: "Item 1", link: "https://example.com/item1" },
              { title: "Item 2", link: "https://example.com/item2" },
            ],
          }),
      })
    );

    render(<Feed feedUrl={mockFeedUrl} />);

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  it("displays an error when fetching fails", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    render(<Feed feedUrl={mockFeedUrl} />);

    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  it("analyzes the feed with evinced", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              { title: "Item 1", link: "https://example.com/item1" },
              { title: "Item 2", link: "https://example.com/item2" },
            ],
          }),
      })
    );

    const { container } = render(<Feed feedUrl={mockFeedUrl} />);

    await waitFor(() => {
      EvincedUT.analyzeFeed(container);
      expect(EvincedUT.analyzeFeed).toHaveBeenCalledWith(container);
    });

    global.fetch.mockRestore();
  });
});
