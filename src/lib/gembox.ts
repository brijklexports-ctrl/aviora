// Client for the public GraphQL API that gembox.app's own catalog pages call
// for pagination (graphql.gemlightbox.com). No auth is required for public
// share-link catalogs, which is what makes this a viable sync source.

const GRAPHQL_ENDPOINT = "https://graphql.gemlightbox.com/graphql";

const CATALOG_UUID = process.env.GEMBOX_CATALOG_UUID || "mnix9bljni";

const LIST_QUERY = `
query LinkProductList($uuid: String!, $page: Int, $pageSize: Int, $sortRule: productSortRuleInput) {
  linkProductList(uuid: $uuid, pageSize: $pageSize, page: $page, sortRule: $sortRule) {
    totalRecords
    totalPages
    data {
      id
      productType
      price
      currency
      title
      description
      sku
      quantity
      attributes {
        name
        displayName
        value
        kind
        suffix
        prefix
      }
      link {
        uuid
      }
      medias {
        id
        mediaPosition
        type
        file {
          original
          medium
          small
        }
      }
    }
  }
}`;

export interface GemboxAttribute {
  name: string;
  displayName: string;
  value: string | null;
  kind: string;
  suffix: string | null;
  prefix: string | null;
}

export interface GemboxMedia {
  id: number;
  mediaPosition: number;
  type: string;
  file: {
    original: string | null;
    medium: string | null;
    small: string | null;
  };
}

export interface GemboxProduct {
  id: number;
  productType: string;
  price: number | null;
  currency: string | null;
  title: string;
  description: string | null;
  sku: string | null;
  quantity: number | null;
  attributes: GemboxAttribute[];
  link: { uuid: string } | null;
  medias: GemboxMedia[];
}

interface LinkProductListResponse {
  data?: {
    linkProductList: {
      totalRecords: number;
      totalPages: number;
      data: GemboxProduct[];
    };
  };
  errors?: Array<{ message: string }>;
}

async function fetchPage(
  page: number,
  pageSize: number
): Promise<{ data: GemboxProduct[]; totalPages: number; totalRecords: number }> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationName: "LinkProductList",
      query: LIST_QUERY,
      variables: {
        uuid: CATALOG_UUID,
        page,
        pageSize,
        sortRule: { createdAt: "DESC" },
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`gembox graphql request failed: ${res.status} ${res.statusText}`);
  }

  const json: LinkProductListResponse = await res.json();

  if (json.errors?.length) {
    throw new Error(`gembox graphql errors: ${json.errors.map((e) => e.message).join("; ")}`);
  }

  if (!json.data) {
    throw new Error("gembox graphql response missing data");
  }

  return json.data.linkProductList;
}

// Fetches every product in the source catalog, paging through the same
// GraphQL endpoint the gembox.app "Show More" button uses.
export async function fetchAllGemboxProducts(pageSize = 50): Promise<GemboxProduct[]> {
  const first = await fetchPage(1, pageSize);
  const all = [...first.data];

  for (let page = 2; page <= first.totalPages; page++) {
    const next = await fetchPage(page, pageSize);
    all.push(...next.data);
  }

  return all;
}
