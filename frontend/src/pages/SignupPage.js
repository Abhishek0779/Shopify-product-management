import React, { useState, useEffect } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Link,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react'
import API from '../utils/Axios'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = () => {
    // FE validation logic for form data 
    if (!form.email || !form.password || !form.confirmPassword) {
      toast({
        title: '',
        description: 'Please fill all required fields ',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else if (form.password !== form.confirmPassword) {
      toast({
        title: '',
        description: 'Your password and confirmation password do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else {
      // API call to backed for create new user
      API.post('api/register', form)
        .then(res => {
          if (res.status === 201) {
            toast({
              title: '',
              description: 'User created please login',
              status: 'success',
              duration: 3000,
              isClosable: true
            })
            navigate('/Login')
          } else {
            navigate('/Signup')
          }
        })
        .catch(err => {
          toast({
            title: '',
            description: err.response.data.message,
            status: 'error',
            duration: 3000,
            isClosable: true
          })
          navigate('/Signup')
        })
    }
  }

  // Function for update form state on change
  const handleChange = (e, field) => {
    let tempform = form
    tempform[field] = e.target.value
    setForm(tempform)
  }

  // Use effect hook to check if the user is already logged in
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      API.get(`api/is-login`)
        .then(res => {
          if (res.status === 200) {
            navigate('/')
          }
        })
        .catch(err => {
        })
    }
  }, [])

  return (
    <Box as='section' pt='4.5rem' pb='3.5rem' maxW='3xl' mx='auto' px='1.5rem'>
      <Stack spacing='2.5rem'>
        <Heading as='h2' fontSize='2.25rem'>
          Sign up
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing='1.5rem'>
            <FormControl id='email'>
              <FormLabel srOnly>Email address</FormLabel>
              <Input
                type='email'
                name='email'
                defaultValue={form.email}
                onChange={e => handleChange(e, 'email')}
                placeholder='Email address'
                required
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel srOnly>Password</FormLabel>
              <Input
                type='password'
                name='password'
                defaultValue={form.password}
                onChange={e => handleChange(e, 'password')}
                placeholder='Password'
                required
              />
            </FormControl>
            <FormControl id='confirmPassword'>
              <FormLabel srOnly>Confirm password</FormLabel>
              <Input
                type='password'
                name='confirmPassword'
                defaultValue={form.confirmPassword}
                onChange={e => handleChange(e, 'confirmPassword')}
                placeholder='Confirm password'
                required
              />
            </FormControl>
            <Button
              colorScheme='teal'
              fontSize='1.125rem'
              w='100%'
              onClick={handleSubmit}
            >
              Sign up
            </Button>
          </Stack>
        </form>
        <Text>
          Already have an account?{' '}
          <Link color='teal.500' href='/Login'>
            Log in
          </Link>
        </Text>
      </Stack>
    </Box>
  )
}

export default SignupPage
