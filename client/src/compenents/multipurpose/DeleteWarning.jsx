import React from 'react'
import Modal from './Modal'

export default function DeleteWarning({
  handleDelete,
  open,
  setOpen,
  review,
  discussion,
}) {
  return (
    <Modal
      open={open}
      style={{
        backgroundColor: 'var(--alt-dark)',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'auto',
        boxShadow: '0 0px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <span>{`Are you sure you want to delete this ${
        review ? 'review' : discussion ? 'discussion' : 'list'
      }?`}</span>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
        <button
          className="square-btn submit-btn"
          onClick={(e) => handleDelete(e)}
        >
          Yes
        </button>
        <button
          className="square-btn cancel-btn"
          onClick={() => setOpen(false)}
        >
          No
        </button>
      </div>
    </Modal>
  )
}
