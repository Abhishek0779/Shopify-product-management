import React, { useState, useEffect } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Spinner,
  Box,
  Text,
  useToast,
  Stack
} from '@chakra-ui/react'
import { AddIcon, ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/Axios'

const Datatable = token => {
  const [resposneData, setResposneData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filteredData, setFilteredData] = useState([])
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState({ column: 'title', direction: 'asc' })
  const navigate = useNavigate()
  const toast = useToast()

  // useEffect hook to for get data from backend and set to states
  useEffect(() => {
    if (token) {
      // send get Call for get list of product
      API.get(`api/list_products`)
        .then(res => {
          setResposneData(res.data.products)
          setFilteredData(res.data.products)
          setIsLoading(false)
        })
        .catch(err => {
          navigate('/Login')
        })
    }
  }, [])

  // useEffect hook for handle onChange Search for title,sku
  useEffect(() => {
    if (!search) {
      setFilteredData(resposneData)
      return
    }

    const filtered = filteredData.filter(
      product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product?.variants.some(variant => variant?.sku.includes(search))
    )

    setFilteredData(filtered)
  }, [search])

  // Function to set state value of search
  const handleSearchChange = e => {
    setSearch(e.target.value)
  }

  // Function to handle delete button
  const handleDelete = product_id => {
    // send DELETE request to backend for delete product
    API.delete(`api/delete_product/${product_id}`)
      .then(res => {
        if (res.status === 200) {
          toast({
            title: '',
            description: 'Product deleted',
            status: 'error',
            duration: 3000,
            isClosable: true
          })
          // send GET request to backend for get updated product list
          API.get(`api/list_products`)
            .then(res => {
              setResposneData(res.data.products)
              setFilteredData(res.data.products)
            })
            .catch(err => {
              navigate('/Login')
            })
        }
      })
      .catch(err => {
        navigate('/')
      })
  }

  // Function for clear button,clear search field
  const handleSearchClear = () => {
    setSearch('')
  }

  // Function for sorting data asc,desc for title,sku,price
  const sortData = column => {
    const { direction, column: sortedColumn } = sorting
    let newDirection = 'asc'

    if (sortedColumn === column) {
      newDirection = direction === 'asc' ? 'desc' : 'asc'
    }

    setSorting({ column, direction: newDirection })

    const dataSort = filteredData.sort((a, b) => {
      switch (column) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'sku':
          return a?.variants[0].sku.localeCompare(b?.variants[0].sku)
        case 'price':
          return a?.variants[0].price - b?.variants[0].price
        default:
          return 0
      }
    })

    if (newDirection === 'desc') {
      dataSort.reverse()
    }

    setFilteredData(dataSort)
  }

  return (
    <>
      {isLoading ? (
        <Box align='center' m={200}>
          <Spinner size='xl' />
        </Box>
      ) : (
        <>
          <Input
            placeholder='Search'
            value={search}
            onChange={handleSearchChange}
            marginTop={4}
          />
          <Stack spacing={4} direction='row' align='flex-end' marginTop={4}>
            <Button onClick={handleSearchClear} variant='outline' mb={4}>
              Clear
            </Button>
            <Button
              onClick={() => {
                navigate('/product/add')
              }}
              variant='outline'
              mb={4}
            >
              <AddIcon boxSize={4} marginRight={2} />
              Add
            </Button>
          </Stack>
          <Table variant='striped' colorScheme='gray'>
            <Thead>
              <Tr>
                <Th key='title' onClick={() => sortData('title')}>
                  Title
                  {sorting.column === 'title' && sorting.direction === 'asc' ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                  <Text>Total = {filteredData.length}</Text>
                </Th>
                <Th key='Image'>Image</Th>
                <Th key='sku' onClick={() => sortData('sku')}>
                  Sku{' '}
                  {sorting.column === 'sku' && sorting.direction === 'asc' ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                </Th>
                <Th key='price' onClick={() => sortData('price')}>
                  Price{' '}
                  {sorting.column === 'price' && sorting.direction === 'asc' ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                </Th>
                <Th key='action'>action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map(item => (
                <Tr key={item?.id}>
                  <Td
                    key='title'
                    onClick={() =>
                      navigate(`product/${item?.id}`, { state: { data: item } })
                    }
                  >
                    {item?.title}
                  </Td>
                  <Td key='Image'>
                    <img
                      src={item?.image?.src}
                      alt={item?.image?.alt}
                      width={100}
                    />
                  </Td>
                  {item?.variants ? (
                    <Td key='sku'>{item?.variants[0]?.sku}</Td>
                  ) : (
                    <Td key='sku'></Td>
                  )}
                  {item?.variants ? (
                    <Td key='price'>{item?.variants[0]?.price}</Td>
                  ) : (
                    <Td key='price'></Td>
                  )}

                  <Td key='action'>
                    <Button
                      colorScheme='green'
                      m={2}
                      onClick={() =>
                        navigate(`product/${item?.id}`, {
                          state: { data: item }
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme='red'
                      onClick={product_id => handleDelete(item?.id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </>
  )
}

export default Datatable
