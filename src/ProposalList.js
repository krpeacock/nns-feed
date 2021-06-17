import React from "react"
import Link from "gatsby-link"

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <span>{props.text}</span>
  }
}

const IndexPage = ({ pageContext }) => {
  const { group, index, first, last, pageCount } = pageContext

  const previousUrl = index - 1 == 1 ? "/" : "/" + (index - 1).toString()
  const nextUrl = "/" + (index + 1).toString()

  return (
    <div>
      <h1>NNS Proposal Feed</h1>
      {group.map(({ id, slug, proposal, proposal_timestamp_seconds }) => (
        <article key={proposal_timestamp_seconds} className="blogListing">
          <Link className="blogUrl" to={slug}>
            <h3>Proposal #{id}</h3>
          </Link>
          {proposal[0].summary}
          <p>
            <a href={proposal[0].url}>{proposal[0].url}</a>
          </p>
        </article>
      ))}
      <nav>
        <div className="previousLink">
          <NavLink test={first} url={previousUrl} text="Go to Previous Page" />
        </div>
        <div className="nextLink">
          <NavLink test={last} url={nextUrl} text="Go to Next Page" />
        </div>
      </nav>
      <div>
        Page {index} of {pageCount}
      </div>
    </div>
  )
}
export default IndexPage
