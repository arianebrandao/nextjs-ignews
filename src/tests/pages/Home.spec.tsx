import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "$9.90" }} />);

    expect(screen.getByText("for $9.90 month")).toBeInTheDocument();
  });

  it("loads initial data from getStaticProps", async () => {
    const retrievePriceStripeMocked = jest.mocked(stripe.prices.retrieve);

    retrievePriceStripeMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 990,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$9.90",
          },
        },
      })
    );
  });
});
