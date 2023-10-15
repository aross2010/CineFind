import ListView from './elements/ListView'

export default function ListsList({
  film,
  lists,
  isUserPage,
  sortMethod,
  isHomePage,
  setLists,
}) {
  const renderedLists = lists.map((list, i) => {
    return (
      <ListView
        film={film}
        list={list}
        key={i}
        sortMethod={sortMethod}
        isUserPage={isUserPage}
        isHomePage={isHomePage}
        setLists={setLists}
      />
    )
  })

  return lists.length > 0 ? renderedLists : <span>No Lists.</span>
}
