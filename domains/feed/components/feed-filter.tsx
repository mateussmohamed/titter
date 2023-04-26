'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import type { FilterType } from '@/domains/platform/entities'

import { FeedContext } from '../context/feed-context'

import debounce from 'lodash.debounce'
import { Search } from 'lucide-react'

export function FeedFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { fetchTitters } = useContext(FeedContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, toggleFilter] = useState<string>(searchParams.get('filter') || 'all')
  const filterFromQuery = searchParams.get('filter')

  const handleDebounceFn = (value: string) => {
    fetchTitters('all', value)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(debounce(handleDebounceFn, 500), [])

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value)
    debounceFn(e.currentTarget.value)
  }

  const handleChange = () => {
    const filter = filterValue === 'following' ? 'all' : 'following'
    toggleFilter(filter)
    router.push(`/?filter=${filter}`)
  }

  useEffect(() => {
    if (filterFromQuery) {
      toggleFilter(filterFromQuery as FilterType)
    }
  }, [filterFromQuery])

  return (
    <div className="mb-3 flex flex-col gap-2">
      <div className="flex flex-row px-5 py-3">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="search on titter"
            value={searchTerm}
            onChange={handleInputChange}
            data-cy="search-input"
            className="py-4 pl-12"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
            <Search />
          </div>
        </div>
        <div className="flex min-w-[180px] flex-row items-center justify-end px-5">
          <label htmlFor="home-filter" className="mb-0 mr-2">
            {filterValue === 'following' ? 'Following titters' : 'All titters'}
          </label>
          <Switch
            id="home-filter"
            data-cy="home-filter"
            onCheckedChange={handleChange}
            checked={filterValue === 'following'}
            value={filterValue}
          />
        </div>
      </div>

      {searchTerm?.length > 5 && (
        <div className="flex flex-row  px-5">
          <p className="">
            Results for: <span className="font-bold">{searchTerm}</span>
          </p>
        </div>
      )}
      <Separator />
    </div>
  )
}