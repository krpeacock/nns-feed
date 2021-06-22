const agentImport = require("@dfinity/agent")
const { Actor, HttpAgent } = agentImport
const fetch = require("node-fetch")
const fs = require("fs")
const JSONbig = require("json-bigint")({ storeAsString: true })

const governance_idl = require("./governance.did.js").default

const canisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai"
const increment = 100

const agent = new HttpAgent({ host: "https://ic0.app", fetch })
const governance = Actor.createActor(governance_idl, { agent, canisterId })

const fetchData = async () => {
  let allData = []
  let incomplete = true
  let lastEntry = increment
  while (incomplete) {
    try {
      const lastId = lastEntry ? [{ id: BigInt(lastEntry) }] : []
      const newData = await governance.list_proposals({
        include_reward_status: [],
        limit: increment,
        exclude_topic: [],
        include_status: [],
        before_proposal: lastId,
      })
      if (newData && newData.proposal_info.length) {
        const result = newData.proposal_info.map(proposal=>{
          proposal
          proposal.proposalNumber = proposal.id[0].id;
          return proposal;
        })
        allData = [...allData, ...result]
      } else {
        break
      }
      lastEntry += increment
      console.log(`Fetching proposals from NNS: ${allData.length}`)
    } catch (error) {
      console.error(error)
      break
    }
  }
  return allData.map(proposal=>{
    proposal.proposalNumber = Number(proposal.id[0].id) || null;
    return proposal;
  }).sort((a, b) => a.proposalNumber - b.proposalNumber)
}
//  fetchData().then(data => {
//   console.log(data[0])
//   JSONbig.stringify(data[5]) //?
//   Object.keys(data[1])
// })


module.exports = {
  fetchData,
}
