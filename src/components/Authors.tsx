import { ET_WAP_URL, ET_WEB_URL } from "utils/common"

export const Authors = (authors) => {
  
  return (
    <>
      {authors.authors.map((author, index) => {
        return (
          <span key={index}>
            {index > 0 && index === authors.authors.length - 1 ? " & " : ""}
            <a className="authorlink" href={author?.url?.replace(ET_WAP_URL, ET_WEB_URL)} target="_blank">{author.title}</a>
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