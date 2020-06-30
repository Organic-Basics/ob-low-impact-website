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
        images(first: 10) {
          edges {
            node {
              transformedSrc(maxWidth: 390, maxHeight: 390, crop: CENTER, scale: ${imageScale})
            }
          }
        },
        variants(first: 50) {
          edges {
            node {
              selectedOptions {
                name,
                value
              },
              id,
              availableForSale,
              compareAtPrice
            }
          }
        }
      `)
    }

  export default productQuery