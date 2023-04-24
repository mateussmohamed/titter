'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormControl, FormLabel, Stack, Switch } from '@chakra-ui/react'

import { FilterType } from '@/domains/platform/entities'

export function PostsFilter() {
  const searchParams = useSearchParams()

  const router = useRouter()

  const username = searchParams.get('username') || searchParams.get('profile')

  const filterParam = searchParams.get('filter')

  const [filterValue, toggleFilter] = useState<string>(searchParams.get('filter') || 'all')

  const handleChange = () => {
    const filter = filterValue === 'following' ? 'all' : 'following'

    toggleFilter(filter)

    router.push(`/?filter=${filter}`)
  }

  useEffect(() => {
    if (filterParam) {
      toggleFilter(filterParam as FilterType)
    }
  }, [filterParam])

  return (
    <Stack direction="row" py={2} px={5}>
      <FormControl display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
        <FormLabel htmlFor="home-filter" mb="0">
          {filterValue === 'following' ? 'Following posts' : 'All posts'}
        </FormLabel>
        <Switch
          id="home-filter"
          data-cy="home-filter"
          onChange={handleChange}
          isChecked={filterValue === 'following'}
          value={filterValue}
        />
      </FormControl>
    </Stack>
  )
}
