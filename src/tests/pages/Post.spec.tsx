import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/client";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "test-post",
  title: "Test Post",
  content: "<p>Post content</p>",
  updatedAt: "June, 22",
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    });

    const response = await getServerSideProps({
      params: {
        slug: "test-post",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = jest.mocked(getSession);
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "Test Title" }],
          content: [{ type: "paragraph", text: "Post content" }],
        },
        last_publication_date: "06-22-1990",
      }),
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    });

    const response = await getServerSideProps({
      params: {
        slug: "test-post",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "test-post",
            title: "Test Title",
            content: "<p>Post content</p>",
            updatedAt: "22 de junho de 1990",
          },
        },
      })
    );
  });
});
