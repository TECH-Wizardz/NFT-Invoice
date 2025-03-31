import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Replace with your subgraph URL
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/107624/invoice-nft/version/latest';

const httpLink = createHttpLink({
  uri: SUBGRAPH_URL,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${import.meta.env.VITE_THE_GRAPH_API_KEY}`,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // If you want all queries to bypass the cache:
          '*': {
            merge: false,
          },
          // Or, for specific queries:
          // yourQueryName: {
          //   merge: false,
          // },
        },
      },
    },
  }),
}); 