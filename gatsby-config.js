const JSONbig = require("json-bigint")
/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `NNS Proposal Feed`,
    siteUrl: `https://nns-proposal-feed.netlify.app`,
  },
  plugins: [
    require.resolve(`./plugins/source-plugin`),
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
      {
        proposals: allProposal(sort: {order: DESC, fields: proposalNumber}) {
          edges {
            node {
              id
              internal {
                content
              }
              proposalNumber
            }
          }
        }
        site {
          siteMetadata {
            title
            siteUrl
            site_url: siteUrl
          }
        }
      }
    `,
        feeds: [
          {
            serialize: ({ query: { site, proposals } }) => {
              return proposals.edges.map(edge => {
                const proposal = JSONbig.parse(edge.node.internal.content)
                const id = edge.node.proposalNumber
                proposal.slug = `/proposals/${id}`

                return {
                  title: proposal.proposal[0].summary,
                  description: proposal.proposal[0].url,
                  date: proposal.proposal_timestamp_seconds * 1000,
                  url: site.siteMetadata.siteUrl + proposal.slug,
                  guid: site.siteMetadata.siteUrl + proposal.slug,
                }
              })
            },
            query: `
            {
              proposals: allProposal(sort: {order: DESC, fields: proposalNumber}) {
                edges {
                  node {
                    id
                    internal {
                      content
                    }
                    proposalNumber
                  }
                }
              }
            }
          `,
            output: "/rss.xml",
            title: "NNS Proposals",
            match: "^/proposals/",
          },
        ],
      },
    },
  ],
}
