import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Flex,
  useToast,
  Image,
  Text,
  Spinner,
  VStack,
  Stack,
  Button,
  Input
} from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import API from '../../../../utils/Axios'

const ViewUpdateProduct = ({ product_id }) => {
  const navigate = useHistory()
  const toast = useToast()

  const [product, setProduct] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isEditable, setisEditable] = useState(true)
  const [editedData, setEditedData] = useState({})

  // useEffect hook to fetch product data and set loading state
  useEffect(() => {
    API.get(`api/get_product/${product_id}`)
      .then(res => {
        if (res.status === 200) {
          const prd = res.data.product
          setProduct(prd)
          setIsLoading(false)
          setEditedData({
            product: {
              title: prd.title,
              variants: [
                {
                  price: prd.price,
                  sku: prd.sku
                }
              ]
            }
          })
        }
      })
      .catch(err => {
        navigate.push('/')
      })
  }, [product_id])

  // Function for save update data in backend
  const handleSave = () => {
    // send PATCH request to update product data
    API.put(`api/update_product/${product.id}`, editedData)
      .then(res => {
        if (res.status === 200) {
          toast({
            title: '',
            description: 'Product changes Done',
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
    setisEditable(true)
  }

  // Function for handle changes for edited data input fields
  const handleChanges = (e, field) => {
    let tempData = editedData
    if (field === 'price') {
      tempData.product.variants[0].price = e.target.value
    }
    if (field === 'sku') {
      tempData.product.variants[0].sku = e.target.value
    }
    if (field === 'title') {
      tempData.product.title = e.target.value
    }

    setEditedData(tempData)
  }
  const handleCancelEdit = () => {
    setisEditable(true)
  }

  // Function for delete data from backend
  const handleDelete = () => {
    // send DELETE request to delete product
    API.delete(`api/delete_product/${product.id}`)
      .then(res => {
        if (res.status === 200) {
          toast({
            title: '',
            description: 'Product deleted',
            status: 'error',
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
  return (
    <>
      {isLoading ? (
        <Box align='center' m={200}>
          <Spinner size='xl' />
        </Box>
      ) : (
        <>
          <VStack alignItems='flex-end'>
            <Stack spacing={4} direction='row'>
              {isEditable ? (
                <>
                  <Button
                    onClick={() => setisEditable(false)}
                    variant='outline'
                    mb={4}
                  >
                    Edit
                  </Button>
                  <Button onClick={handleDelete} mb={4} colorScheme='red'>
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleCancelEdit}
                    variant='outline'
                    mb={4}
                    colorScheme='red'
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} mb={4} colorScheme='blue'>
                    Save
                  </Button>
                </>
              )}
            </Stack>
          </VStack>
          <VStack spacing={8} align='right'>
            <Flex>
              <Image
                src={product?.image}
                alt={'product'}
                objectFit='contain'
                maxH='400px'
              />
              <VStack spacing={4} align='start' pl={8}>
                <Text fontSize='lg'>
                  Title :
                  <Input
                    defaultValue={product.title}
                    placeholder=''
                    disabled={isEditable}
                    onChange={e => handleChanges(e, 'title')}
                  />
                </Text>
                <Text fontSize='lg'>
                  Sku:{' '}
                  <Input
                    defaultValue={product.sku}
                    placeholder=''
                    disabled={isEditable}
                    onChange={e => handleChanges(e, 'sku')}
                  />
                </Text>
                <Text fontSize='lg'>
                  Price:{' '}
                  <Input
                    defaultValue={product.price}
                    placeholder=''
                    disabled={isEditable}
                    onChange={e => handleChanges(e, 'price')}
                  />
                </Text>
                <Text fontSize='lg'>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.body_html }}
                  />
                </Text>
              </VStack>
            </Flex>
          </VStack>
        </>
      )}
    </>
  )
}

export default ViewUpdateProduct
