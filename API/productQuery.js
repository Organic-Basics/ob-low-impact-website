const productQuery = (imageScale) => {
    return(
        `title,
        id,
        handle,
        description,
        priceRange {
          minVariantPrice {
            amount,
            currencyCode
          }
        },
        tags,
        options {
          name,
          values
        }
        images(first: 25) {
          edges {
            node {
              transformedSrc(maxWidth: 390, maxHeight: 390, crop: CENTER, scale: ${imageScale})
            }
          }
        },
        variants(first: 100) {
          edges {
            node {
              selectedOptions {
                name,
                value
              },
              id,
              title,
              availableForSale,
              compareAtPrice
            }
          }
        }
      `)
    }

  export default productQuery