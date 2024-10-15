import React, { Fragment } from 'react'

export default function RenderText({ text = "" }) {
  
  function renderText(text) {
    // replace html entities
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');

    return text;
  }

  // if text contains html tags, render them as react elements else return text as it is
  return text.includes('<') ? <div dangerouslySetInnerHTML={{ __html: text }} /> : <Fragment>{renderText(text)}</Fragment>
}
