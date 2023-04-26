'use client'

import { memo, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { TitterFeed, TitterPayload } from '@/domains/platform/entities'
import { abbreviation, cn } from '@/domains/platform/lib/utils'
import titterService from '@/domains/platform/services/titter'

import { FeedContext } from '../context/feed-context'

import { AddNewTitter } from './add-new-titter'

import { ArrowLeftRight, MessageSquare } from 'lucide-react'

interface TitterCardProps {
  titter: TitterFeed
}

const TitterCardComponent = ({ titter }: TitterCardProps) => {
  const {
    id,
    user,
    createdAt,
    kind,
    body,
    referencedTitter,
    retitter,
    quote,
    loggedUserQuoted,
    loggedUserRetittered,
    sameUser
  } = titter
  const { toast } = useToast()
  const router = useRouter()

  const { fetchTitters } = useContext(FeedContext)
  const [quoteInputIsOpen, toggleQuoteInput] = useState(false)

  const isRetittered = kind === 'retitter'
  const isQuoted = kind === 'quote'
  const isAReferenced = isRetittered || isQuoted

  const titterCreatedAt = createdAt
  const hasReferencedTitter = isAReferenced && referencedTitter
  const dateItisAReferenced = hasReferencedTitter ? referencedTitter.createdAt : titterCreatedAt

  const creatTitter = async (payload: TitterPayload) => {
    try {
      await titterService.newTitter({ ...payload })

      fetchTitters('all')
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Oh no =(',
          description: error.message,
          variant: 'destructive',
          duration: 3000
        })
      }
    }
  }

  const handleRetitter = () => {
    creatTitter({
      body: '',
      kind: 'retitter',
      referencedTitter: { id, user, createdAt, kind, body },
      createdAt: new Date().toLocaleString()
    })
  }

  const handleOpentQuoteInput = () => {
    toggleQuoteInput(!quoteInputIsOpen)
  }

  return (
    <div className="flex px-5" data-test="titter-card" data-cy={`titter-card-${kind}`}>
      <div className="flex flex-col items-center">
        <Avatar
          data-cy="open-profile"
          className="cursor-pointer text-2xl text-slate-200"
          onClick={() => router.push(`/?profile=${user?.username}`)}
        >
          <AvatarFallback className="bg-slate-900">{abbreviation(user?.name || '')}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-1 flex-col pl-2 pt-2">
        {isAReferenced && (
          <div className="mb-2 flex flex-1">
            {isRetittered && (
              <>
                <ArrowLeftRight className="text-slate-400" />
                <span className="ml-1 text-slate-900">
                  <span data-cy="titter-card-retittered-by">{sameUser ? 'you' : user?.name} retittered on</span>
                </span>
              </>
            )}
            {isQuoted && (
              <>
                <MessageSquare className="text-slate-400" />
                <span className="ml-1 text-slate-900">
                  <span data-cy="titter-card-quoted-by">{sameUser ? 'you' : user?.name} commented on</span>
                </span>
              </>
            )}
            <span className="ml-1 text-slate-900">{titterCreatedAt}</span>
          </div>
        )}

        {isQuoted && (
          <div className="flex break-words py-2">
            <span data-cy="titter-card-quote-body">{body}</span>
          </div>
        )}

        <div
          className={cn(
            'flex flex-col rounded-md',
            isAReferenced ? 'border border-slate-200 bg-slate-50 p-2' : 'border-none bg-transparent'
          )}
        >
          <div className="flex flex-row items-center">
            {isAReferenced && (
              <Avatar
                className="mr-2 h-8 w-8 cursor-pointer text-sm text-slate-200"
                onClick={() => router.push(`/?profile=${referencedTitter?.user?.username}`)}
              >
                <AvatarFallback className="bg-slate-500">
                  {abbreviation(referencedTitter?.user?.name || '')}
                </AvatarFallback>
              </Avatar>
            )}

            <span className="text-sm text-slate-400">
              {isAReferenced ? referencedTitter?.user?.name : user?.name} on {dateItisAReferenced}
            </span>
          </div>

          <div className={cn('flex flex-row break-words', isAReferenced ? 'pl-10 pr-4' : 'px-0')}>
            <span data-cy="titter-card-body">{isAReferenced ? referencedTitter?.body : body}</span>
          </div>
        </div>

        {!sameUser && kind !== 'retitter' && (
          <div className="flex flex-row">
            <Button onClick={() => handleOpentQuoteInput()} variant="ghost" data-cy="titter-card-quote-button">
              <MessageSquare className={loggedUserQuoted ? 'text-purple-400' : 'text-slate-400'} />
              <span className={`ml-2 text-xl ${loggedUserQuoted ? 'text-purple-400' : 'text-slate-400'}`}>
                {quote.count}
              </span>
            </Button>

            <Button onClick={() => handleRetitter()} variant="ghost" data-cy="titter-card-retitter-button">
              <ArrowLeftRight className={loggedUserRetittered ? 'text-green-400' : 'text-slate-400'} />
              <span className={`ml-2 text-xl ${loggedUserRetittered ? 'text-green-400' : 'text-slate-400'}`}>
                {retitter.count}
              </span>
            </Button>
          </div>
        )}

        {quoteInputIsOpen ? (
          <AddNewTitter payload={{ referencedTitter: { id, user, createdAt, body, kind }, kind: 'quote' }} />
        ) : null}
      </div>
    </div>
  )
}

export const TitterCard = memo(TitterCardComponent)
