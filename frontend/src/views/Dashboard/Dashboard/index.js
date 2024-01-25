// Chakra imports
import {
  Flex,
  Box,
  Image,
  Spinner,
  Button,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import React, { useState, useEffect } from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { NavLink, useHistory } from 'react-router-dom'
import API from '../../../utils/Axios'
import Cookies from 'js-cookie'

const gridStyle = { minHeight: 550, marginTop: 10, width: '100%' }

export default function Dashboard () {
  const [isLoading, setIsLoading] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const navigate = useHistory()

  const filterValue = [
    { name: 'title', operator: 'contains', type: 'string', value: '' },
    { name: 'sku', operator: 'contains', type: 'string', value: '' }
  ]

  const columns = [
    {
      name: 'id',
      type: 'number',
      maxWidth: 40,
      header: 'ID',
      defaultVisible: false
    },
    {
      name: 'image',
      header: 'Image',
      defaultFlex: 2,
      render: record => (
        <Image
          src={record.data.image}
          alt='Product'
          style={{ width: '100%', height: 'auto' }}
        />
      )
    },
    {
      name: 'title',
      defaultFlex: 2,
      header: 'Title',
      width: 150,
      render: record => (
        <NavLink to={'/admin/product/' + record.data.id}>
          {record.data.title}
        </NavLink>
      )
    },
    { name: 'sku', defaultFlex: 1.5, header: 'Sku', width: 50 },
    { name: 'price', defaultFlex: 0.5, header: 'Price', width: 25 },
    {
      name: 'actions',
      header: 'Actions',
      minWidth: 120,
      defaultFlex: 2,
      render: record => (
        <Box align='center' >
          <Button
            colorScheme='green'
            onClick={() => handleEdit(record.data.id)}
            // m={1}
          >
            Edit
          </Button>
          {/* <Button
            colorScheme='red'
            onClick={() => handleDelete(record.data.id)}
            m={1}
          >
            Delete
          </Button> */}
        </Box>
      )
    }
  ]

  const calculateRowHeight = record => {
    setIsLoading(true)
    // Assuming the image has a fixed height, you can adjust this based on your actual image sizes
    const imageHeight = 50 // Adjust according to your image height
    const minHeight = 60 // Minimum row height

    // Calculate row height based on the image height
    setIsLoading(false)
    return Math.max(imageHeight, minHeight)
  }
  
  const handleEdit = id => {
    // Handle edit action, e.g., open a modal for editing
    navigate.push(`/admin/product/${id}`)
  }

  const token = Cookies.get('access_token')

  // useEffect hook to for get data from backend and set to states
  useEffect(() => {
    if (token !== null) {
      // send get Call for get list of product
      API.get(`api/list_products`)
        .then(res => {
          if (res.status === 200) {
            setFilteredData(res.data.products)
            setIsLoading(false)
          } else {
            navigate.push('/auth/signin')
          }
        })
        .catch(err => {
          navigate.push('/auth/signin')
        })
    }
  }, [token])
  return (
    <Flex flexDirection='column' pt={{ base: '120px', md: '75px' }}>
      {isLoading ? (
        <Box align='center' m={200}>
          <Spinner size='xl' />
        </Box>
      ) : (
        <>
          <Grid templateColumns='repeat(5, 1fr)' gap={4}>
            <GridItem colStart={8} colEnd={12} >
              <Button
                onClick={() => {
                  navigate.push('/admin/product/add')
                }}
                variant='outline'
                mb={4}
                colorScheme='blue'
              >
                <AddIcon boxSize={4} marginRight={2} />
                Add
              </Button>
            </GridItem>
          </Grid>
          <ReactDataGrid
            idProperty='id'
            style={gridStyle}
            columns={columns}
            pagination
            defaultFilterValue={filterValue}
            dataSource={filteredData}
            defaultLimit={10}
            rowHeight={calculateRowHeight}
          />
        </>
      )}
    </Flex>
  )
}
