'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { TitterPayload } from '@/domains/platform/entities'
import { MAXIMUM_BODY_LENGTH } from '@/domains/platform/lib/constants'
import { cn } from '@/domains/platform/lib/utils'

import { useFeedContext } from '../context/feed-context'

import { Loader2 } from 'lucide-react'

interface AddNewTitterProps {
  payload?: TitterPayload
}

export function AddNewTitter({ payload }: AddNewTitterProps) {
  const { addNewTitter } = useFeedContext()
  const [loadingAddNewTitter, setLoadingAddNewTitter] = useState(false)

  const [body, setBody] = useState('')
  const { toast } = useToast()

  const remainingChars = MAXIMUM_BODY_LENGTH - body.length
  const isInvalidValue = remainingChars < 0

  const handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setBody(e.currentTarget.value)
  }

  const handleAddNewTitter = async (body: string) => {
    try {
      setLoadingAddNewTitter(true)
      await addNewTitter({
        kind: 'titter',
        ...payload,
        body
      })

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
    } finally {
      setLoadingAddNewTitter(false)
    }
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
        <Button
          disabled={loadingAddNewTitter || body.length === 0}
          onClick={() => handleAddNewTitter(body)}
          data-cy="titter-btn"
        >
          {loadingAddNewTitter ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          New Titter
        </Button>
      </div>
    </div>
  )
}
