export const Authors = (authors) => {
  
  return (
    <>
      {authors.authors.map((author, index) => {
        return (
          <a href={author.url} key={index}>{author.title}</a>
        )
      })}
    </>
  )
}