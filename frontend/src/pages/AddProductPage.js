import React, { useState } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  VStack,
  useToast
 } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import API from '../utils/Axios'
 function AddProduct() {
  const [data, setData] = useState({
    title:"",
    price:"",
    sku:"",
  });
  const navigate = useNavigate()
  const toast = useToast()


  // Function for set input value to state
  const handleChanges = (e, field) => {
    let tempData = data
    tempData[field] = e.target.value
    setData(tempData)
  }

  // Function for handle validation and backend call
  const handleAddProduct = () => {
    if (!data.title || !data.price || !data.sku) {
      toast({
        title: '',
        description: 'Please fill all required fields ',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }else{
      // send Post request to create product in backend 
      API.post(`api/create_product`, data)
        .then(res => {
          if (res.status === 201 ) {
            toast({
              title: '',
              description: 'Product added',
              status: 'success',
              duration: 3000,
              isClosable: true
            })
            navigate('/')
          }
        })
        .catch(err => {
          navigate('/')
        })
    }
  }
  return (
     <Center>
       <VStack m={20}>
         <Box p={10} bg="white" borderRadius="lg" boxShadow="lg">
           <FormControl id="productName" isRequired>
             <FormLabel>Product Title</FormLabel>
             <Input type="text" onChange={e => handleChanges(e, 'title')}/>
           </FormControl>
 
           <FormControl id="productPrice" isRequired>
             <FormLabel>Product Price</FormLabel>
             <Input type="number" step="0.01" onChange={e => handleChanges(e, 'price')}/>
           </FormControl>
 
           <FormControl id="productImageURL" isRequired>
             <FormLabel>Product Sku</FormLabel>
             <Input type="text" onChange={e => handleChanges(e, 'sku')}/>
           </FormControl>
 
           <Button colorScheme="teal" mt={4} type="submit" onClick={handleAddProduct}>
             Add Product
           </Button>
         </Box>
       </VStack>
     </Center>
  );
 }
 
 export default AddProduct;