[![Build Status](https://img.shields.io/static/v1.svg?label=CSL&message=software%20against%20climate%20change&color=green?style=flat&logo=github)](https://img.shields.io/static/v1.svg?label=CSL&message=software%20against%20climate%20change&color=green?style=flat&logo=github)

# The Low Impact Website by Organic Basics

The internet is dirty. Data transfer requires electricity, which creates carbon emissions — and this leads to climate change. The Low Impact website reduces data transfer by up to 70% in comparison to our regular website.

## Low Impact Manifesto

To build this website, we wrote down 10 rules for how to make a low impact website. We share these openly, so you can use it in your own project.

### A low impact website:
    1. Does not load any images before they are actively requested by the user.
    2. Minimizes the power consumption on the users device.
    3. Adapts to reflect the amount of renewable energy it’s currently running on.
    4. Informs the user of the impact of their browsing behavior.
    5. Does not make use of videos.
    6. Stores data locally on the user’s device to minimize data transfer.
    7. Compresses all data to the greatest extent possible.
    8. Loads only the most crucial programming scripts, frameworks and cookies.
    9. Limits the amount of light emitted by the screen.
    10. Optimizes and limits the use of custom fonts.

## Setup

The Low Impact Website uses Shopify's [Storefront API](https://shopify.dev/docs/storefront-api) to fetch products and basic ecommerce functionality.
It uses the [Nuxt.js framework](https://github.com/nuxt/nuxt.js).

### Installation

To get started, you first need to install [Yarn](https://yarnpkg.com/), and then run `yarn install`.

### Environment variables

#### Shopify

To setup your environment variables, you should copy the `.env.example` file and rename it `.env`.
Then you must fill it out with your own Shopify setup. 

Organic Basics uses 4 different production Shopify shops and 1 for development, so we have defined 5 Apollo clients in `nuxt.config.js`: _eur_, _gbp_, _usd_, _dkk_ and _dev_.

These 5 different configs are used to navigate between different currencies, and thus Shopify shops.

This happens via the `_locale` part of the Nuxt routing, e.g. [https://lowimpact.organicbasics.com/eur](https://lowimpact.organicbasics.com/eur). 

You might not need 5 different shops, and so you must adapt the `nuxt.config.js` and `.env` files.

#### Contentful

We also use Contentful to display some content on the product pages. To fetch this, you must fill in `.contentful.json` with your own values.

## Usage

To start the development server at `localhost:3000`, run `yarn dev`.

To build for production, run `yarn build`.

To launch the server and the production build, run `yarn start`

For a more detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Disclaimer

The Low Impact Website code is highly customized to the Organic Basics' website setup, and will more than likely not easily transfer to your setup.

Thus the main outcomes of making this code available to the public will likely be in sharing learnings and techniques, instead of providing a plug-and-play solution for low impact websites. But if you want to make such a thing, let us know! 

## Support

Organic Basics does not currently have the resources to provide any support to help you setup this project.

If you find any bugs, issues or similar, please create an issue on this Github repository.

## License

The Low Impact Website code is released under the [Climate Strike License](https://github.com/climate-strike/license). 