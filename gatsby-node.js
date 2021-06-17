const path = require("path")
const JSONbig = require("json-bigint")({ storeAsString: true })

const createPaginatedPages = require("gatsby-paginate")

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const foo = await graphql(`
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
  `)

  const proposals = foo.data.proposals.edges.map(edge => {
    const proposal = JSONbig.parse(edge.node.internal.content)
    const id = proposal.id[0].id.toString()
    proposal.id = id
    proposal.slug = `/proposals/${id}`
    return JSON.parse(JSONbig.stringify(proposal))
  })
  return new Promise((resolve, reject) => {
    createPaginatedPages({
      edges: proposals,
      createPage: createPage,
      pageTemplate: "src/ProposalList.js",
      context: {}, // This is optional and defaults to an empty object if not used
    })
    proposals.map(proposal => {
      createPage({
        path: proposal.slug,
        component: path.resolve("./src/Proposal.js"),
        context: {
          slug: proposal.slug,
          ...proposal,
        },
      })
    })
    resolve()
  })
}
