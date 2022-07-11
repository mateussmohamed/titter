import React, { useState } from 'react'
import { Button, Stack, Text, Textarea } from '@chakra-ui/react'

import { MAXIMUM_BODY_LENGTH } from '~/domains/platform/constants'

interface WritePostInputProps {
  onWritePost: (body: string) => void
}

export function WritePostInput({ onWritePost }: WritePostInputProps) {
  const [text, setText] = useState('')

  const handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value)
  }

  const handleWrite = () => {
    onWritePost(text)
    setText('')
  }

  const remainingChars = MAXIMUM_BODY_LENGTH - text.length
  const isInvalidValue = remainingChars < 0

  return (
    <Stack direction="row" px={5}>
      <Stack align="flex-end" flexShrink={0} flexGrow={1}>
        <Textarea
          placeholder="What's happening..."
          value={text}
          isInvalid={isInvalidValue}
          onChange={handleInputChange}
          data-cy="post-input"
        />
        <Stack direction="row" align="center" justify="flex-end">
          <Text as="span" color={isInvalidValue ? 'red' : 'black'}>
            {remainingChars}
          </Text>
          <Button isDisabled={text.length === 0} onClick={handleWrite} data-cy="post-btn">
            Post
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
