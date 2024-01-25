// Chakra imports
import { Flex, Box, Spinner } from '@chakra-ui/react'

import React, { useState, useEffect } from 'react'

import ReactDataGrid from '@inovua/reactdatagrid-community'

import '@inovua/reactdatagrid-community/index.css'
import { useHistory } from 'react-router-dom'
import API from '../../../utils/Axios'
import Cookies from 'js-cookie'

// Setting the grid style
const gridStyle = { minHeight: 550, marginTop: 10, width: '100%' }

// Defining the ActivityLog component
export default function ActivityLog () {
  // const dataSource = useCallback(loadData, []);
  const [isLoading, setIsLoading] = useState(true)
  const [activityData, setActivityData] = useState([])
   // Filter value for search
  const filterValue = [
    { name: 'action', operator: 'contains', type: 'string', value: '' },
    { name: 'description', operator: 'contains', type: 'string', value: '' },
  ]

  // Columns for the grid
  const columns = [
    {
      name: 'id',
      type: 'number',
      maxWidth: 40,
      header: 'ID',
      defaultVisible: false
    },
    {
      name: 'timestamp',
      header: 'Date & Time',
      defaultFlex: 2,
      
    },
    {
      name: 'action',
      header: 'action',
      defaultFlex: 2
    },
    {
      name: 'description',
      header: 'description',
      defaultFlex: 2
    }
  ]

  const navigate = useHistory()
  const token = Cookies.get('access_token')

  // useEffect hook to for get data from backend and set to states
  useEffect(() => {
    if (token !== null) {
      // send get Call for get list of product
      API.get(`api/get-activity-log`)
        .then(res => {
          if (res.status === 200) {
            setActivityData(res.data.logs)
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
        <ReactDataGrid
          idProperty='id'
          style={gridStyle}
          columns={columns}
          pagination
          defaultFilterValue={filterValue}
          dataSource={activityData}
          defaultLimit={10}
        />
      )}
    </Flex>
  )
}
