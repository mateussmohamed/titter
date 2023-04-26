'use client'

import { useContext, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { MAXIMUM_BODY_LENGTH } from '@/domains/platform/lib/constants'
import { KindTitter, TitterPayload } from '@/domains/platform/entities'
import titterService from '@/domains/platform/services/titter'
import { cn } from '@/domains/platform/lib/utils'

import { FeedContext } from '../context/feed-context'

interface AddNewTitterProps {
  payload?: TitterPayload
}

export function AddNewTitter({ payload }: AddNewTitterProps) {
  const [body, setBody] = useState('')
  const { fetchTitters } = useContext(FeedContext)
  const { toast } = useToast()

  const remainingChars = MAXIMUM_BODY_LENGTH - body.length
  const isInvalidValue = remainingChars < 0

  const handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setBody(e.currentTarget.value)
  }

  const addNewTitter = async (body: string) => {
    try {
      await titterService.newTitter({
        kind: 'titter',
        ...payload,
        body,
        createdAt: new Date().toLocaleString()
      })

      fetchTitters('all')

      setBody('')
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Oh no =(',
          description: error.message,
          duration: 3000
        })
      }
    }
  }

  const handleAddNewTitter = () => {
    addNewTitter(body)
  }

  return (
    <div className="flex flex-col gap-2 px-5">
      <Textarea
        placeholder="What's happening..."
        value={body}
        onChange={handleInputChange}
        data-cy="titter-input"
        className={cn(isInvalidValue ? 'border-red-600' : 'border-slate-500')}
      />
      <div className="flex flex-row items-center justify-end gap-4">
        <span className={cn(isInvalidValue ? 'text-red-600' : 'text-slate-500')}>{remainingChars}</span>
        <Button disabled={body.length === 0} onClick={handleAddNewTitter} data-cy="titter-btn">
          New Titter
        </Button>
      </div>
    </div>
  )
}
