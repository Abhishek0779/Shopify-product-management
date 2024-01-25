import React from 'react'
import { Box } from '@chakra-ui/react'
import AddProduct from '../Products/components/AddProduct'
import ViewUpdateProduct from '../Products/components/ViewUpdateProduct'
import { useParams } from 'react-router-dom'

const Product = () => {
  const params = useParams()
  return (
    <Box marginTop={20}>
      {params.id.toLowerCase() === 'add' ? (
        <AddProduct />
      ) : (
        <ViewUpdateProduct product_id={params.id} />
      )}
    </Box>
  )
}

export default Product
