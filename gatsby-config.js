const JSONbig = require("json-bigint")
/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `NNS Proposal Feed`,
    siteUrl: `https://60cb9ef6014df611fc7fba14--serene-minsky-dca73c.netlify.app`,
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
            }
            proposalNumber
          }
          distinct(field: proposalNumber)
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
                const id = proposal.proposalNumber
                proposal.id = id
                proposal.slug = `/proposals/${id}`

                return {
                  description: proposal.proposal.summary,
                  date: proposal.proposal_timestamp_seconds,
                  url: site.siteMetadata.siteUrl + proposal.slug,
                  guid: site.siteMetadata.siteUrl + proposal.slug,
                }
              })
            },
            query: `
            {
              proposals: allProposal {
                edges {
                  node {
                    id
                    internal {
                      content
                    }
                  }
                }
                distinct(field: id)
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
