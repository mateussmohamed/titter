import { Avatar, Badge, Box, Button, Skeleton, SkeletonCircle, Stack, Text } from '@chakra-ui/react'

import { Profile } from '~/domains/platform/entities'

interface ProfileDataProps {
  loadingProfile: boolean
  profile?: Profile
  handleFollow: () => void
}

export const ProfileData = ({ loadingProfile, profile, handleFollow }: ProfileDataProps) => {
  return (
    <Stack direction="column">
      <Stack
        direction="row"
        px={4}
        borderBottomLeftRadius={4}
        borderBottomRightRadius={4}
        align="center"
        height="200px"
        bg="blackAlpha.400"
        justifyContent="space-between"
      >
        <SkeletonCircle isLoaded={!loadingProfile} size="128px">
          <Avatar name={profile?.name} bg="black" color="white" size="2xl" />
        </SkeletonCircle>

        {profile?.showFollowButton && (
          <Button isLoading={loadingProfile} onClick={handleFollow} variant="solid" data-cy="follow-btn">
            {profile?.loggedUserFollowProfile ? 'unfollow' : 'follow'}
          </Button>
        )}
      </Stack>

      <Stack direction="column" px={5} spacing={1}>
        <Skeleton height="45px" noOfLines={1} isLoaded={!loadingProfile}>
          <Stack direction="row">
            <Box>
              <Text fontWeight="bold" color="black" fontSize="3xl">
                {profile?.name}
                {profile?.profileFollowLoggedUser && (
                  <Badge variant="outline" ml={4}>
                    follow you
                  </Badge>
                )}
              </Text>
              <Text color="black" fontWeight="bold" fontSize="xl">
                {profile?.username}{' '}
                <Text as="span" color="gray.500" fontWeight="normal" fontSize="medium">
                  Joined in {profile?.createdAt}
                </Text>
              </Text>
            </Box>
          </Stack>
        </Skeleton>

        <Skeleton height="27px" noOfLines={1} isLoaded={!loadingProfile}>
          <Stack direction="row">
            <Text color="black" fontWeight="bold" fontSize="large">
              {profile?.followingCount}
            </Text>
            <Text color="gray.500" fontSize="large">
              Following
            </Text>
            <Text color="black" fontSize="large">
              •
            </Text>
            <Text color="black" fontWeight="bold" fontSize="large">
              {profile?.followersCount}
            </Text>
            <Text color="gray.500" fontSize="large">
              Followers
            </Text>
            <Text color="black" fontSize="large">
              •
            </Text>
            <Text color="black" fontWeight="bold" fontSize="large">
              {profile?.postsCount}
            </Text>
            <Text color="gray.500" fontSize="large">
              Posts
            </Text>
          </Stack>
        </Skeleton>
      </Stack>
    </Stack>
  )
}
