import { useContext, useEffect } from 'react'
import { services } from '../../../data/filters-data'
import { FiltersContext } from '../../../pages/FindPage'

export default function Services() {
  const { filters, setFilters } = useContext(FiltersContext)

  const handleChange = (e) => {
    const serviceID = parseInt(e.target.value)
    const isChecked = e.target.checked

    setFilters((previousFilters) => {
      if (isChecked) {
        if (previousFilters.services) {
          return {
            ...previousFilters,
            services: [...previousFilters.services, serviceID],
          }
        } else
          return {
            ...previousFilters,
            services: [serviceID],
          }
      } else if (previousFilters.services) {
        return {
          ...previousFilters,
          services: previousFilters.services.filter((id) => id !== serviceID),
        }
      } else {
        return {
          ...previousFilters,
          services: [],
        }
      }
    })
  }

  const renderedServices = services.map((service) => {
    return (
      <li
        key={service.id}
        style={{ display: 'inline' }}
      >
        <input
          type="checkbox"
          name="services[]"
          value={service.id}
          id={service.name}
          className="services-input checkbox-input"
          onChange={handleChange}
          hidden
        />
        <label
          key={service.id}
          className="checkbox-label services-label"
          htmlFor={service.name}
        >
          {service.name}
        </label>
      </li>
    )
  })

  return <ul>{renderedServices}</ul>
}
