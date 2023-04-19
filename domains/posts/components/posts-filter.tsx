import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FormControl, FormLabel, Stack, Switch } from '@chakra-ui/react'

import { FilterType } from '~/domains/platform/entities'

export function PostsFilter() {
  const urlParams = new URLSearchParams(window.location.search)

  const { push, query } = useRouter()

  const [filterValue, toggleFilter] = useState<string>(urlParams.get('filter') || 'all')

  const handleChange = () => {
    const filter = filterValue === 'following' ? 'all' : 'following'

    toggleFilter(filter)

    push(`/?filter=${filter}`)
  }

  useEffect(() => {
    if (query?.filter) {
      toggleFilter(query?.filter as FilterType)
    }
  }, [query?.filter])

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
