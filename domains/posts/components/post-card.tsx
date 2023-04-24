'use client'

import { memo, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, Button, Stack, Text, useToast } from '@chakra-ui/react'
import * as Unicons from '@iconscout/react-unicons'

import { FeedPost, PostPayload } from '@/domains/platform/entities'
import titter from '@/domains/platform/services/titter'

import { PostsContext } from '../context/posts-context'

import { WritePostInput } from './write-post-input'

interface PostCard {
  post: FeedPost
}

const Card = ({ post }: PostCard) => {
  const {
    id,
    user,
    createdAt,
    kind,
    body,
    referencedPost,
    repost,
    quote,
    loggedUserQuoted,
    loggedUserReposted,
    sameUser
  } = post
  const toast = useToast()
  const router = useRouter()

  const { fetchPosts } = useContext(PostsContext)
  const [quoteInputIsOpen, toggleQuoteInput] = useState(false)

  const isReposted = kind === 'repost'
  const isQuoted = kind === 'quote'
  const isAReferenced = isReposted || isQuoted

  const postCreatedAt = createdAt
  const hasReferencedPost = isAReferenced && referencedPost
  const dateItisAReferenced = hasReferencedPost ? referencedPost.createdAt : postCreatedAt

  const creatPost = async (payload: PostPayload) => {
    try {
      await titter.writePost({ ...payload })

      fetchPosts('all')
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Oh no =(',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      }
    }
  }

  const handleQuote = (postValue: string) => {
    creatPost({
      body: postValue,
      kind: 'quote',
      referencedPost: { id, user, createdAt, kind, body },
      createdAt: new Date().toLocaleString()
    })
  }

  const handleRepost = () => {
    creatPost({
      body: '',
      kind: 'repost',
      referencedPost: { id, user, createdAt, kind, body },
      createdAt: new Date().toLocaleString()
    })
  }

  const handleOpentQuoteInput = () => {
    toggleQuoteInput(!quoteInputIsOpen)
  }

  return (
    <Stack direction="row" px={5} data-test="post-card" data-cy={`post-card-${kind}`}>
      <Stack direction="column" pt={2}>
        <Avatar
          onClick={() => router.push(`/?profile=${user?.username}`, `/profile/${user?.username}`)}
          name={user?.name}
          data-cy="open-profile"
          bg="black"
          color="gray.200"
          cursor="pointer"
        />
      </Stack>

      <Stack direction="column" pl={2} flex={1}>
        {isAReferenced && (
          <Stack direction="row">
            {isReposted && (
              <>
                <Unicons.UilExchange color="gray" />
                <Text color="black">
                  <span data-cy="post-card-reposted-by">{sameUser ? 'you' : user?.name} reposted on</span>
                </Text>
              </>
            )}
            {isQuoted && (
              <>
                <Unicons.UilCommentDots color="gray" />
                <Text color="black">
                  <span data-cy="post-card-quoted-by">{sameUser ? 'you' : user?.name} commented on</span>
                </Text>
              </>
            )}
            <Text color="black">{postCreatedAt}</Text>
          </Stack>
        )}

        {isQuoted && (
          <Stack direction="row" wordBreak="break-word">
            <span data-cy="post-card-quote-body">{body}</span>
          </Stack>
        )}

        <Stack
          direction="column"
          border={isAReferenced ? '1px' : '0'}
          borderColor={isAReferenced ? 'gray.200' : 'transparent'}
          padding={isAReferenced ? 2 : 0}
          borderRadius="md"
          bg={isAReferenced ? 'gray.50' : 'white'}
          spacing={0}
        >
          <Stack direction="row">
            {isAReferenced && (
              <Avatar
                name={referencedPost?.user?.name}
                onClick={() =>
                  router.push(
                    `/?profile=${referencedPost?.user?.username}`,
                    `/profile/${referencedPost?.user?.username}`
                  )
                }
                cursor="pointer"
                bg="gray.500"
                size="sm"
                color="gray.200"
                as="a"
              />
            )}

            <Text color="gray.400" size="small">
              {isAReferenced ? referencedPost?.user?.name : user?.name} on {dateItisAReferenced}
            </Text>
          </Stack>

          <Stack direction="row" wordBreak="break-word" pr={isAReferenced ? 4 : 0} pl={isAReferenced ? 10 : 0}>
            <span data-cy="post-card-body">{isAReferenced ? referencedPost?.body : body}</span>
          </Stack>
        </Stack>

        {!sameUser && kind !== 'repost' && (
          <Stack direction="row">
            <Button
              onClick={() => handleOpentQuoteInput()}
              colorScheme={loggedUserQuoted ? 'purple' : 'gray'}
              leftIcon={<Unicons.UilCommentDots color={loggedUserQuoted ? 'purple' : 'gray'} />}
              variant="ghost"
              data-cy="post-card-quote-button"
            >
              <Text color={loggedUserQuoted ? 'purple' : 'gray'}>{quote.count}</Text>{' '}
            </Button>

            <Button
              onClick={() => handleRepost()}
              leftIcon={<Unicons.UilExchange color={loggedUserReposted ? 'green' : 'gray'} />}
              colorScheme={loggedUserReposted ? 'green' : 'gray'}
              variant="ghost"
              data-cy="post-card-repost-button"
            >
              <Text color={loggedUserReposted ? 'green' : 'gray'}>{repost.count}</Text>{' '}
            </Button>
          </Stack>
        )}

        {quoteInputIsOpen && <WritePostInput onWritePost={handleQuote} />}
      </Stack>
    </Stack>
  )
}

export const PostCard = memo(Card)
