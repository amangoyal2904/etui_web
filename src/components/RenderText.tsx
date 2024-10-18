import React, { Fragment } from 'react'

export default function RenderText({ text = "" }) {

  const textStr = text?.toString();
  
  function renderText(text) {
    // replace html entities
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');

    return text;
  }

  // if text contains html tags, render them as react elements else return text as it is
  return textStr?.toString()?.includes('<') ? <div dangerouslySetInnerHTML={{ __html: textStr }} /> : <Fragment>{renderText(textStr)}</Fragment>
}
