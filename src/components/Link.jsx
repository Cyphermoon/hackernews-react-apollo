import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { AUTH_TOKEN, LINKS_PER_PAGE } from '../constants'
import { timeDifferenceForDate } from '../util'
import { FEED_QUERY } from './LinkList';

const VOTE_MUTATION = gql`
mutation VoteMutation($linkId: ID!) {
  vote(linkId: $linkId) {
    id
    link {
      id
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

const Link = ({ link, index }) => {
  const authToken = localStorage.getItem(AUTH_TOKEN)

  const skip = 0
  const take = LINKS_PER_PAGE
  const orderBy = { createdAt: "desc" }

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id
    },
    update: (cache, { data: { vote } }) => {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        }
      });

      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === link.id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote]
          };
        }
        return feedLink;
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: updatedLinks
          }
        },
        variables: {
          take,
          skip,
          orderBy
        }
      });
    }

  })

  return (
    <div className="flex mt3 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        <div
          className="ml1 gray f11"
          style={{ cursor: 'pointer' }}
          onClick={vote}
        >
          ▲
        </div>
      </div>
      <div className="ml1">
        <div className='mb1 flex flex-wrap items-center'>
          <span className='mr2-l'>{link.description}</span>
          <small>({link.url})</small>
        </div>
        {authToken && (
          <div className="f6 lh-copy gray">
            {link.votes.length} votes | by{' '}
            {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Link