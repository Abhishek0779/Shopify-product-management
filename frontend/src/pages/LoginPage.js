import React, { useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Link,
  Text
} from '@chakra-ui/react'
import API from '../utils/Axios'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  // useEffect hook to validate login 
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      API.get(`api/is-login`)
        .then(res => {
          if (res.status === 200) {
            navigate('/')
          }
        })
        .catch(err => {
          navigate('/Login')
        })
    }
  },[])

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
            navigate('/')
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
    <>
      <Box
        w='100%'
        maxW='500px'
        mx='auto'
        p={5}
        marginTop={70}
        marginBottom={70}
      >
        <FormControl id='email' mb={4}>
          <FormLabel>Email address</FormLabel>
          <Input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id='password'>
          <FormLabel>Password</FormLabel>
          <Input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme='teal' onClick={handleSubmit}>
          Login
        </Button>
        <Text marginTop={10}>
          Want to create an account?{' '}
          <Link color='teal.500' href='/Signup'>
            Sign up
          </Link>
        </Text>
      </Box>
    </>
  )
}
LoginPage.propTypes = {}
export default LoginPage
