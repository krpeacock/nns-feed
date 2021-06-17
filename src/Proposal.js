import React from "react"

function Proposal({ pageContext }) {
  return (
    <main>
      <h1>proposal</h1>
      <section>
        <pre>{JSON.stringify(pageContext)}</pre>
      </section>
    </main>
  )
}

export default Proposal
