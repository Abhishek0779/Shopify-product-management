import React from 'react'
import { Link } from '@chakra-ui/react'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import { Box, Text } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box as='footer' backgroundColor='gray.700' py='12' color='white'>
      <Box maxW='7xl' mx='auto' px={{ base: '4', md: '8' }}>
        <Text textAlign='center' fontSize='lg'>
          Developed By Abhishek Trivedi
        </Text>
        <Text textAlign='center' fontSize='lg' mt='4'>
          Contact :-{' '}
          <Link href='mailto:abskshrimali@gmail.com'>
            {' '}
            abskshrimali@gmail.com
          </Link>{' '}
          <Link href='tel:+7490000779'>7490000779</Link>
          <Link
            href='https://www.linkedin.com/in/abhishek-trivedi-ba0742155/'
            m={3}
          >
            <LinkedInIcon />
          </Link>
          <Link href='https://github.com/Abhishek0779' m={3}>
            <GitHubIcon />
          </Link>
        </Text>
      </Box>
    </Box>
  )
}

export default Footer
