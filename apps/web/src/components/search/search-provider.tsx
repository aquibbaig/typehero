import * as React from 'react';

import type { Challenge } from '@repo/db/types';
import algoliasearch from 'algoliasearch/lite';
import { useHits, useInstantSearch, useSearchBox } from 'react-instantsearch';
import { InstantSearchNext, type InstantSearchNextProps } from 'react-instantsearch-nextjs';

const searchClient = algoliasearch(
  // eslint-disable-next-line @typescript-eslint/dot-notation
  process.env['NEXT_PUBLIC_ALGOLIA_APP_ID'],
  // eslint-disable-next-line @typescript-eslint/dot-notation
  process.env['NEXT_PUBLIC_ALGOLIA_API_KEY'],
);

const INDEX_NAME = 'typehero';

// TODO-UPGRADE:temporary-fix -- the library is not supported to run with React 19:
// ref: https://github.com/algolia/instantsearch/issues/6409
declare module 'react-instantsearch-nextjs' {
  export function InstantSearchNext(props: InstantSearchNextProps<any>): React.ReactNode;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  return (
    <InstantSearchNext
      searchClient={{
        ...searchClient,
        search(requests) {
          const isEmptyQuery = requests.every(({ params }) => !params?.query);
          if (isEmptyQuery) {
            return Promise.resolve({
              results: requests.map(
                () =>
                  ({
                    hits: [],
                  }) as never,
              ),
            });
          }

          return searchClient.search(requests);
        },
      }}
      indexName={INDEX_NAME}
    >
      {children}
    </InstantSearchNext>
  );
}

export function useSearchStatus() {
  const { status } = useInstantSearch();
  return { status };
}

export function useSearchResult() {
  const { hits, results } = useHits<Challenge>();
  const query = results?.query;

  return { results: hits, query };
}
export type Result = ReturnType<typeof useSearchResult>['results'][number];

export function useSearchProviderInput() {
  const { query, refine } = useSearchBox();

  const update = (newQuery: string) => {
    refine(newQuery);
  };

  return { query, update };
}
