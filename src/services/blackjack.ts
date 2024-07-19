// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const blackjackApi = createApi({
  reducerPath: "game",
  baseQuery: fetchBaseQuery({ baseUrl: "https://deckofcardsapi.com/api/" }),
  endpoints: (builder) => ({
    /*
     *    query: ({ id, ...patch }) => ({ url: `post/${id}`, method: 'PATCH', body: patch }),

     *    // Pick out data and prevent nested properties in a hook or selector
     *    transformResponse: (response) => response.data,
     * 
     *    // Pick out error and prevent nested properties in a hook or selector
     *    transformErrorResponse: (response) => response.error,
     * 
     *    // `result` is the server response
     *    invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
     * 
     *    // trigger side effects or optimistic updates
     *    onQueryStarted(id, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) {},
     * 
     *    // handle subscriptions etc
     *    onCacheEntryAdded(id, { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry }) {},
     */
    example: builder.query({
      query: () => `example/`,
    }),
    newDeck: builder.query({
      query: () => `deck/new/`,
    }),
    shuffleCards: builder.query({
      query: () => `deck/new/shuffle/?deck_count=1`,
    }),
    drawCards: builder.query<any, any>({
      query: (args: any) =>
        `deck/${args.deck_id}/draw/?count=${args.card_count}`,
    }),
    addToPile: builder.query<any, any>({
      query: (args: any) =>
        `deck/${args.deck_id}/pile/${args.player}/add/?cards=${args.cards.map((card: any) => card.code).join(",")}`,
    }),
    listPile: builder.query<any, any>({
      query: (args: any) => `deck/${args.deck_id}/pile/${args.player}/list/`,
    }),
    returnCards: builder.query<any, any>({
      query: (args: any) => `deck/${args.deck_id}/pile/${args.pile}/return`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useShuffleCardsQuery,
  useDrawCardsQuery,
  useNewDeckQuery,
  useLazyDrawCardsQuery,
  useLazyAddToPileQuery,
  useLazyReturnCardsQuery,
  useLazyShuffleCardsQuery,
  useListPileQuery,
  useLazyListPileQuery,
} = blackjackApi;
