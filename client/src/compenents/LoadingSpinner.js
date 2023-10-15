import React from 'react'
import Modal from './Modal'
import { CircularProgress } from '@chakra-ui/react'

export default function Loading() {
  const other = (
    <CircularProgress
      isIndeterminate
      color="#76F88E"
      trackColor="transparent"
      size="6rem"
      thickness="0.35rem"
    ></CircularProgress>
  )
  return (
    <Modal
      open={true}
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: 'none',
      }}
    >
      {other}
    </Modal>
  )
}
