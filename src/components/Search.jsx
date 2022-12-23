import { gql, useLazyQuery } from '@apollo/client'
import React, { useState } from 'react'
import Link from './Link'

const Search = () => {
    const [searchFilter, setSearchFilter] = useState("")
    const FEED_SEARCH_QUERY = gql`
    query FeedSearchQuery($filter: String!) {
        feed(filter: $filter) {
        id
        links {
            id
            url
            description
            createdAt
            postedBy {
            id
            name
            }
            votes {
            id
            user {
                id
            }
            }
        }
        }
    }
`;
    const [executeSearch, { data }] = useLazyQuery(FEED_SEARCH_QUERY)
    return (
        <>
            Search
            <input
                type="text"
                placeholder='What do you want to search'
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)} />
            <button
                onClick={() => {
                    executeSearch({
                        variables: {
                            filter: searchFilter
                        }
                    })
                }}>OK</button>
            {data &&
                data.feed.links.map((link, index) => {
                    return <Link index={index} key={link.id} link={link} />
                })}
        </>
    )
}

export default Search