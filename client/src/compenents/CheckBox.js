import React, { useState } from 'react'
import '../styles/checkbox.css'
import { FaCheck } from 'react-icons/fa'

export default function CheckBox({ checked }) {
  return <div className="checkbox">{checked && <FaCheck />}</div>
}
