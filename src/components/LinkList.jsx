import { gql, useQuery } from '@apollo/client';
import React from 'react'
import Link from './Link';

export const FEED_QUERY = gql`
{
   feed {
      id
      links {
           id
           createdAt
           url
           description
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
}
`

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
    const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY)

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
        document: NEW_VOTES_SUBSCRIPTION,
    })

    return (
        <div>
            {data &&
                data.feed.links.map((link, idx) =>
                    <Link key={link.id} link={link} index={idx} />)
            }
        </div>
    )
}

export default LinkList