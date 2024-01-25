import React,{useState,useEffect} from 'react'
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  useToast,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
// Assets
import signInImage from '../../assets/img/signInImage.png'
import API from '../../utils/Axios'
import { useHistory,NavLink } from 'react-router-dom'
import Cookies from 'js-cookie';

function SignIn () {
  // Chakra color mode
  const titleColor = useColorModeValue('teal.300', 'teal.200')
  const textColor = useColorModeValue('gray.400', 'white')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()
  const history = useHistory()

  // useEffect hook to validate login
  // useEffect(() => {
  //   if (localStorage.getItem('access_token')) {
  //     API.get(`api/is-login`)
  //       .then(res => {
  //         if (res.status === 200) {
  //           history.push('/')
  //         }
  //       })
  //       .catch(err => {
  //         history.push('/Login')
  //       })
  //   }
  // }, [])

  // Function for handle login submit with field validation
  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Email and password are required',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    } else {
      var RequestFormData = new FormData()
      RequestFormData.append('email', email)
      RequestFormData.append('password', password)
      // send Post request to validate cred and get access token
      await API.post(`api/login`, RequestFormData)
        .then(res => {
          if (res.status === 200) {
            // set access token in local storage
            localStorage.setItem('access_token', res.data.auth_token)
            history.push('/')
            Cookies.set('access_token', res.data.auth_token); 
          }
        })
        .catch(err => {
          toast({
            title: 'Error',
            description: 'Invalid credentials',
            status: 'error',
            duration: 3000,
            isClosable: true
          })
          return
        })
    }
  }
  return (
    <Flex position='relative' mb='40px'>
      <Flex
        h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ sm: '100px', md: '0px' }}
      >
        <Flex
          alignItems='center'
          justifyContent='start'
          style={{ userSelect: 'none' }}
          w={{ base: '100%', md: '50%', lg: '42%' }}
        >
          <Flex
            direction='column'
            w='100%'
            background='transparent'
            p='48px'
            mt={{ md: '150px', lg: '80px' }}
          >
            <Heading color={titleColor} fontSize='32px' mb='10px'>
              Welcome Back
            </Heading>
            <Text
              mb='36px'
              ms='4px'
              color={textColor}
              fontWeight='bold'
              fontSize='14px'
            >
              Enter your email and password to sign in
            </Text>
            <FormControl>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Email
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='24px'
                fontSize='sm'
                type='text'
                placeholder='Your email adress'
                size='lg'
                name='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Password
              </FormLabel>
              <Input
                borderRadius='15px'
                mb='36px'
                fontSize='sm'
                type='password'
                placeholder='Your password'
                size='lg'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                fontSize='10px'
                type='submit'
                bg='teal.300'
                w='100%'
                h='45'
                mb='20px'
                color='white'
                mt='20px'
                _hover={{
                  bg: 'teal.200'
                }}
                _active={{
                  bg: 'teal.400'
                }}
                onClick={handleSubmit}
              >
                SIGN IN
              </Button>
            </FormControl>
            <Flex
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              maxW='100%'
              mt='0px'
            >
              <Text color={textColor} fontWeight='medium'>
                Don't have an account?
                <NavLink style={{ color:" #4FD1C5" }} as='span' ms='5px' fontWeight='bold' to='/auth/signup' >
                  {" "}
                  Sign Up
                </NavLink>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: 'none', md: 'block' }}
          overflowX='hidden'
          h='100%'
          w='40vw'
          position='absolute'
          right='0px'
          marginRight={50}
          marginTop={20}
        >
          <Box
            bgImage={signInImage}
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius='20px'
          ></Box>
        </Box>
      </Flex>
    </Flex>
  )
}

export default SignIn
