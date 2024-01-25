// Chakra imports
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Image,
  useToast,
  Spinner
} from '@chakra-ui/react'
import React, { useState,useEffect } from 'react'
import API from '../../../../utils/Axios'
import { useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'

const AddProduct = ({}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    sku: '',
    image_name: '',
    image_ext: ''
  })
  const [uploadedImage, setUploadedImage] = useState(null)
  const navigate = useHistory()
  const toast = useToast()

  // useEffect to check authentication
  useEffect(()=>{
    const token = Cookies.get('access_token')
    if(!token){
      navigate.push('auth/signin')
    }
  },[])

  const handleChange = e => {
    const { name, value } = e.target
    setProductData(prevData => ({ ...prevData, [name]: value }))
  }
  // function to handle file input change
  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      const fileName = file.name
      const fileExtension = fileName.split('.').pop()
      setProductData(prevData => ({
        ...prevData,
        image_name: fileName,
        image_ext: fileExtension
      }))
      setUploadedImage(e.target.files[0])
    }
  }


  const handleAddProduct = () => {
    // Handle adding the product data (send to backend, etc.)
    const formData = new FormData()
    formData.append('image', uploadedImage)
    formData.append('title', productData.title)
    formData.append('price', productData.price)
    formData.append('sku', productData.sku)
    formData.append('image_name', productData.image_name)
    formData.append('image_ext', productData.image_ext)
    if (!productData.title || !productData.price || !productData.sku) {
      toast({
        title: '',
        description: 'Please fill all required fields ',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } else {
      // send Post request to create product in backend
      setIsLoading(true)
      API.post(`api/create_product`, formData)
        .then(res => {
          if (res.status === 201) {
            toast({
              title: '',
              description: 'Product added',
              status: 'success',
              duration: 3000,
              isClosable: true
            })
            navigate.push('/')
          }
        })
        .catch(err => {
          navigate.push('/')
        })
    }
  }
  return (
    <>
      {isLoading ? (
        <Box align='center' m={200}>
          <Spinner size='xl' />
        </Box>
      ) : (
        <Box p={4} borderRadius={10}>
          <Text fontSize='xl' fontWeight='bold' m={5}>
            Add Product
          </Text>
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              type='text'
              name='title'
              value={productData.title}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Price</FormLabel>
            <Input
              type='number'
              name='price'
              value={productData.price}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>SKU</FormLabel>
            <Input
              type='text'
              name='sku'
              value={productData.sku}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Image</FormLabel>
            <Input type='file' onChange={handleImageChange} />
            {productData.image && (
              <Image src={productData.image} alt='Product Image' mt={2} />
            )}
          </FormControl>

          <Button colorScheme='teal' onClick={handleAddProduct} mt={2}>
            Add Product
          </Button>
        </Box>
      )}
    </>
  )
}

export default AddProduct
