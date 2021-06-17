const JSONbig = require("json-bigint")({ storeAsString: true })
const fetchData = require("./fetchData").fetchData

// constants for your GraphQL Post and Author types
const NODE_TYPE = `Proposal`
exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions

  const data = await fetchData()

  // loop through data and create Gatsby nodes
  data.forEach(node =>
    createNode({
      ...node,
      id: createNodeId(`${NODE_TYPE}-${node.id[0].id.toString()}`),
      parent: null,
      children: [],
      internal: {
        type: NODE_TYPE,
        contentDigest: createContentDigest(node),
        content: JSONbig.stringify(node),
      },
      // as_json: JSONbig.stringify(JSONbig.parse(node)),
    })
  )
  return
}
