import { useContext } from 'react'
import { PopupContext } from '../context/popupContext'

export default function usePopupHook() {
  const { setPopup } = useContext(PopupContext)

  return {
    setPopup: (msg, success) => {
      setPopup({
        active: true,
        msg,
        success,
      })
    },
  }
}
