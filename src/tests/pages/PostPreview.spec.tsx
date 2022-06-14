import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "test-post",
  title: "Test Post",
  content: "<p>Post content</p>",
  updatedAt: "June, 22",
};

jest.mock("next-auth/client");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: "fake-active-subscription",
      },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);
    expect(pushMock).toHaveBeenCalledWith("/posts/test-post");
  });

  it("loads initial data", async () => {
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

    const response = await getStaticProps({
      params: {
        slug: 'test-post'
      }
    })

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
