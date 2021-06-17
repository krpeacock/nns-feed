const JSONbig = require("json-bigint")
/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `NNS Proposal Feed`,
    siteUrl: `https://peacock.dev/nns-feed`,
  },
  plugins: [
    require.resolve(`./plugins/source-plugin`),
    {
      resolve: `gatsby-plugin-feed`,
      options: {
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
                const id = proposal.id[0].id.toString()
                proposal.id = id
                proposal.slug = `/proposals/${id}`

                return {
                  description: proposal.proposal.summary,
                  date: proposal.proposal_timestamp_seconds,
                  url: site.siteMetadata.siteUrl + "/proposals/" + proposal.id,
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
