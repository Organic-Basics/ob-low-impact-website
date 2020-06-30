const productsQuery = `edges {
    node {
      handle,
      title,
      id,
      tags,
      options {
        name,
        values
      },
      description,
      onlineStoreUrl,
      variants(first:50) {
        edges {
          node {
            id,
            priceV2 {
              amount,
              currencyCode
            },
            compareAtPrice
          }
        }
      },
      images(first: 1) {
        edges {
          node {
            transformedSrc(maxWidth: 300, maxHeight: 390, crop: CENTER)
          }
        }
      }
    }
  }`;


  export default productsQuery