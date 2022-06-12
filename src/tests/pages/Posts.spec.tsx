import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const posts = [
  {
    slug: "test-post",
    title: "Test Post",
    excerpt: "Post excerpt",
    updatedAt: "June, 22",
  },
];

jest.mock("../../services/prismic");

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("loads initial data from getStaticProps", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "test-post",
            data: {
              title: [
                { type:'heading', text: 'Test Post' }
              ],
              content: [
                { type:'paragraph', text: 'Post excerpt' }
              ],
            },
            last_publication_date: "06-22-1990",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "test-post",
              title: "Test Post",
              excerpt: "Post excerpt",
              updatedAt: "22 de junho de 1990",
            }
          ],
        },
      })
    );
  });
});
