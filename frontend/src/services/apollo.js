import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client';

// API URL for GraphQL endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Create HTTP link
const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
});

// Authentication link for adding token to requests
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Return headers
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Helper function to get the store
const getStore = () => {
  return import('../store').then(module => module.store);
};

// Helper function to dispatch actions
const dispatchAction = async (action) => {
  const store = await getStore();
  return store.dispatch(action);
};

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      // Handle token expiration
      if (err.extensions && err.extensions.code === 'UNAUTHENTICATED') {
        // Try to refresh the token
        return new Observable(observer => {
          // Import the actions dynamically to avoid circular dependency
          import('../store/auth/authSlice').then(module => {
            const { refreshToken, logout } = module;
            
            dispatchAction(refreshToken())
              .then((result) => {
                if (result.type.endsWith('/fulfilled')) {
                  // Retry the operation with new token
                  const token = localStorage.getItem('token');
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: token ? `Bearer ${token}` : '',
                    },
                  });
                  
                  // Retry the operation
                  forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });
                } else {
                  // If refresh fails, log out
                  dispatchAction(logout());
                  observer.error(err);
                }
              })
              .catch(() => {
                // If there's an error, log out
                dispatchAction(logout());
                observer.error(err);
              });
          });
        });
      }
    }
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          assets: {
            // Merge function for paginated asset queries
            keyArgs: ['search', ['query', 'collectionIds', 'tagIds', 'statuses']],
            merge(existing = { assets: [], totalCount: 0 }, incoming) {
              return {
                ...incoming,
                assets: [...(existing.assets || []), ...(incoming.assets || [])],
              };
            },
          },
          collections: {
            // Merge function for paginated collection queries
            keyArgs: ['search', ['query', 'brandIds', 'parentId']],
            merge(existing = { collections: [], totalCount: 0 }, incoming) {
              return {
                ...incoming,
                collections: [...(existing.collections || []), ...(incoming.collections || [])],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
}); 