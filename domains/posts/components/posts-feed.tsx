'use client'

import { useCallback, useContext, useState } from 'react'
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  StackDivider,
  Text,
  useToast
} from '@chakra-ui/react'
import * as Unicons from '@iconscout/react-unicons'
import debounce from 'lodash.debounce'

import titter from '@/domains/platform/services/titter'

import { PostsContext } from '../context/posts-context'

import { PostList } from './post-list'
import { PostsFilter } from './posts-filter'
import { WritePostInput } from './write-post-input'

export function PostsFeed() {
  const { loading, posts, fetchPosts } = useContext(PostsContext)
  const [searchTerm, setSearchTerm] = useState('')
  const toast = useToast()

  const handleDebounceFn = (value: string) => {
    fetchPosts('all', value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(debounce(handleDebounceFn, 500), [])

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value)
    debounceFn(e.currentTarget.value)
  }

  const handleOnWritePost = async (body: string) => {
    try {
      await titter.writePost({
        body,
        kind: 'post',
        createdAt: new Date().toLocaleString()
      })

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
    } finally {
      setSearchTerm('')
    }
  }

  return (
    <>
      <Stack
        bg="white"
        mb={6}
        p={4}
        borderRadius="md"
        boxShadow="0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)"
      >
        <InputGroup size="lg">
          <InputLeftElement>
            <Unicons.UilSearch color="gray" />
          </InputLeftElement>
          <Input
            placeholder="search on titter"
            size="lg"
            value={searchTerm}
            onChange={handleInputChange}
            data-cy="search-input"
          />
          <InputRightElement width="4.5rem"></InputRightElement>
        </InputGroup>
      </Stack>

      <Stack
        align="stretch"
        bg="white"
        direction="column"
        boxShadow="0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)"
        py={4}
        borderRadius="md"
        divider={<StackDivider borderColor="gray.200" />}
      >
        <WritePostInput onWritePost={handleOnWritePost} />
        <PostsFilter />

        {searchTerm?.length > 5 && (
          <Stack direction="row" py={2} px={5}>
            <Text>
              Results for:{' '}
              <Text as="span" fontWeight="bold">
                {searchTerm}
              </Text>
            </Text>
          </Stack>
        )}

        <PostList posts={posts} loading={loading} />
      </Stack>
    </>
  )
}
