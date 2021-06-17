const pagination = require("gatsby-awesome-pagination")
const path = require("path")
const { fetchData } = require("./plugins/source-plugin/fetchData")
const JSONbig = require("json-bigint")({ storeAsString: true })
const { paginate, createPagePerItem } = pagination
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

// exports.createPages = async ({ actions, graphql }) => {
//   const { createPage } = actions

//   // Fetch your items (blog posts, categories, etc).
// const proposals = await (await fetchData()).map(proposal => {
//   const id = proposal.id[0].id.toString()
//   proposal.id = id
//   proposal.slug = `/proposals/${id}`
//   return JSON.parse(JSONbig.stringify(proposal))
// })
//   console.log(proposals[0].id)

//   // // Create your paginated pages
//   // paginate({
//   //   createPage, // The Gatsby `createPage` function
//   //   items: proposals, // An array of objects
//   //   itemsPerPage: 1, // How many items you want per page
//   //   pathPrefix: "/proposals", // Creates pages like `/blog`, `/blog/2`, etc
//   //   component: path.resolve("src", "ProposalList.js"), // Just like `createPage()`
//   // })
//   createPagePerItem({
//     createPage,
//     items: proposals,
//     component: path.resolve("src", "Proposal.js"), // Just like `createPage

//     itemToId: "node.id",
//   })
// }
