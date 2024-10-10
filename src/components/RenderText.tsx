import React, { Fragment } from 'react'

export default function RenderText({ text }) {
  
  function renderText(text) {
    
    return text.split(/(<[^>]+>)/).map((item, index) => {
      if (item.startsWith('<')) {
        if (item.startsWith('<a')) {
          const url = item.match(/href="([^"]*)"/)[1];
          const text = item.match(/>([^<]*)</)[1];
          return <a key={index} href={url}>{text}</a>
        } else {
          const tag = item.match(/<([^>]+)>/)[1];
          return <Fragment key={index}>{React.createElement(tag, {}, renderText(item.replace(/<[^>]+>/, '')))}</Fragment>
        }
      } else {
        // replace html entities
        item = item.replace(/&amp;/g, '&');
        item = item.replace(/&lt;/g, '<');
        item = item.replace(/&gt;/g, '>');
        return item
      }
    })
  }

  return (
    <>
      {renderText(text)}
    </>
  )
}
