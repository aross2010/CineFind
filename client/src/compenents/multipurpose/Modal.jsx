import ReactDOM from 'react-dom'
import '../../styles/modal.css'

export default function Modal({ open, onClose, style, children }) {
  return ReactDOM.createPortal(
    <section>
      <div
        className={open ? 'overlay -active' : 'overlay'}
        onClick={onClose}
      />
      <div
        className={open ? 'modal- -active' : 'modal-'}
        style={style}
      >
        {children}
      </div>
    </section>,
    document.getElementById('portal')
  )
}
