import { gql, useQuery } from '@apollo/client';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LINKS_PER_PAGE } from '../constants';
import Link from './Link';

export const FEED_QUERY = gql`
  query FeedQuery(
    $take: Int
    $skip: Int
    $orderBy: LinkOrderByInput
  ) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      links {
        id
        createdAt
        url
        description
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
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
    subscription {
        newLink{
            id
            url
            description
            createdAt
            postedBy{
                id
                name
            }
            votes{
                id
                user{
                    id
                }
            }
        }
    }
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`;


const LinkList = () => {
  const getQueryVariables = (isNewPage, page) => {
    // This methods calculates the values need for pagination

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const take = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = { createdAt: "desc" }

    return { skip, take, orderBy }
  }

  const getLinksToRender = (isNewPage, data) => {
    if (isNewPage) {
      return data.feed.links
    }

    const rankedList = data.feed.links.slice()
    rankedList.sort((l1, l2) => l2.votes.length - l1.votes.length)

    return rankedList
  }

  const location = useLocation()
  const navigate = useNavigate()
  const page = parseInt(useParams().path)
  const isNewPage = location.pathname.includes("new")

  const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: getQueryVariables(isNewPage, page),
    fetchPolicy: "cache-and-network"
  })

  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      //This methods adds the newly added link to the data set and updates the store

      if (!subscriptionData.data) return prev

      const newLink = subscriptionData.data.newLink
      const exists = prev.feed.links.find(({ id }) => id === newLink.id)
      if (exists) return prev

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      })
    }
  })

  subscribeToMore({
    //Subscribes to newly created votes
    document: NEW_VOTES_SUBSCRIPTION,
  })


  if (loading) return <p>loading ...</p>
  else if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
  return (
    <div>
      {data &&
        getLinksToRender(isNewPage, data).map((link, idx) =>
          <Link key={link.id} link={link} index={idx} />)
      }
      {isNewPage &&
        <div className="flex ml4 mv3 gray">
          <div
            className='pointer mr2'
            onClick={() => {
              if (page > 1) {
                navigate(`/new/${page - 1}`)
              }
            }}>
            Previous
          </div>
          <div
            className='pointer'
            onClick={() => {
              if (page < data.feed.count / LINKS_PER_PAGE) {
                navigate(`/new/${page + 1}`)
              }
            }}>
            Next
          </div>
        </div>
      }
    </div>
  )
}

export default LinkList