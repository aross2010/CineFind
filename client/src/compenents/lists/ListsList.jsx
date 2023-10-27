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
      <li key={i}>
        <ListView
          film={film}
          list={list}
          sortMethod={sortMethod}
          isUserPage={isUserPage}
          isHomePage={isHomePage}
          setLists={setLists}
        />
      </li>
    )
  })

  return lists.length > 0 ? <ul>{renderedLists}</ul> : <span>No Lists.</span>
}
