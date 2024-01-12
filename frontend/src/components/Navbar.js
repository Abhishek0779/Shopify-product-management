import React from 'react'
import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  Text,
  Link
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='wrap'
      padding={4}
      bg='teal.500'
      color='white'
    >
      <Link href='/'>
        <Text fontSize='2xl' fontWeight='bold' oncl>
          Shopify product management
        </Text>
      </Link>

      <Box display={{ base: 'none', md: 'flex' }}>
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant='ghost'
          aria-label='Toggle Color Mode'
        />
      </Box>
    </Flex>
  )
}

export default Navbar
