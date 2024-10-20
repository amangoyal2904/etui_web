export const Authors = (authors) => {
  
  return (
    <>
      {authors.authors.map((author, index) => {
        return (
          <span key={index}>
            {index > 0 && index === authors.authors.length - 1 ? " & " : ""}
            <a className="authorlink" href={author.url}>{author.title}</a>
            {index < authors.authors.length - 2 && ", "}
          </span>
        )
      })}
      <style jsx>{`
        .authorlink:hover{
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}