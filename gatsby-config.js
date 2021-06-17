/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  plugins: [require.resolve(`./plugins/source-plugin`), `gatsby-plugin-feed`],
}
