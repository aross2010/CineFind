export default function getAge(date) {
  const dob = new Date(date)
  const currentDate = new Date()
  const age = currentDate.getFullYear() - dob.getFullYear()

  if (
    currentDate.getMonth() < dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() &&
      currentDate.getDate() < dob.getDate())
  ) {
    return age - 1
  }

  return age
}
