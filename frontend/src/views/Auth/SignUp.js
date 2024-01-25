// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
// Assets
import BgSignUp from '../../assets/img/BgSignUp.png'
import React, { useState, useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import API from '../../utils/Axios'
function SignUp () {
  const titleColor = useColorModeValue('teal.300', 'teal.200')
  const textColor = useColorModeValue('gray.700', 'white')
  const bgColor = useColorModeValue('white', 'gray.700')
  const history = useHistory()
  const toast = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  const handleSubmit = () => {
    // FE validation logic for form data
    if (!validateEmail(form.email)) {
      toast({
        title: '',
        description: 'Please enter valid email',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else if (
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.name
    ) {
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
      API.post('/api/register', form)
        .then(res => {
          if (res.status === 201) {
            toast({
              title: '',
              description: 'User created please login',
              status: 'success',
              duration: 3000,
              isClosable: true
            })
            history.push('/auth/signin')
          } else {
            toast({
              title: '',
              description: res.message,
              status: 'error',
              duration: 3000,
              isClosable: true
            })
            // history.push('/auth/Signup')
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
        })
    }
  }

  // Function for update form state on change
  const handleChange = (e, field) => {
    let tempform = form
    tempform[field] = e.target.value
    setForm(tempform)
  }

  return (
    <Flex
      direction='column'
      alignSelf='center'
      justifySelf='center'
      overflow='hidden'
    >
      <Box
        position='absolute'
        minH={{ base: '70vh', md: '50vh' }}
        w={{ md: 'calc(100vw - 50px)' }}
        borderRadius={{ md: '15px' }}
        left='0'
        right='0'
        bgRepeat='no-repeat'
        overflow='hidden'
        zIndex='-1'
        top='0'
        bgImage={BgSignUp}
        bgSize='cover'
        mx={{ md: 'auto' }}
        mt={{ md: '14px' }}
      ></Box>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='6.5rem'
        mb='30px'
      >
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Welcome!
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px'>
        <Flex
          direction='column'
          w='445px'
          background='transparent'
          borderRadius='15px'
          p='40px'
          mx={{ base: '100px' }}
          bg={bgColor}
          boxShadow='0 20px 27px 0 rgb(0 0 0 / 5%)'
        >
          <FormControl>
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Name
            </FormLabel>
            <Input
              name='name'
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              type='text'
              placeholder='Your full name'
              mb='24px'
              size='lg'
              defaultValue={form.name}
              onChange={e => handleChange(e, 'name')}
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Email
            </FormLabel>
            <Input
              name='email'
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              type='email'
              placeholder='Your email address'
              mb='24px'
              size='lg'
              defaultValue={form.email}
              onChange={e => handleChange(e, 'email')}
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Password
            </FormLabel>
            <Input
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              type='password'
              placeholder='Your password'
              mb='24px'
              size='lg'
              name='password'
              defaultValue={form.password}
              onChange={e => handleChange(e, 'password')}
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Confirm Password
            </FormLabel>
            <Input
              fontSize='sm'
              ms='4px'
              borderRadius='15px'
              type='password'
              placeholder='Your Confirm password'
              mb='24px'
              size='lg'
              name='confirmPassword'
              defaultValue={form.confirmPassword}
              onChange={e => handleChange(e, 'confirmPassword')}
            />

            <Button
              type='submit'
              bg='teal.300'
              fontSize='10px'
              color='white'
              fontWeight='bold'
              w='100%'
              h='45'
              mb='24px'
              _hover={{
                bg: 'teal.200'
              }}
              _active={{
                bg: 'teal.400'
              }}
              onClick={handleSubmit}
            >
              SIGN UP
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
              Already have an account?
              <NavLink
                style={{ color:" #4FD1C5" }}
                as='span'
                ms='5px'
                href='#'
                fontWeight='bold'
                to='/Auth/signin'
              >
                {" "}Sign In
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SignUp
