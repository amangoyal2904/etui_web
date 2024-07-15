import React, { useState } from 'react';
import styles from "./styles.module.scss";
import exp from 'constants';

const DropDown = ({question, handleSelectChange, elmTrigger}) => {
  const [selectChange, setSelectChange] = useState(0);
  return (
    <select id={question.key} className={selectChange && elmTrigger ? 'slt_chg' :''} name={question.key} onChange={() => {handleSelectChange(); setSelectChange(1)}}>
      {question.options.map((option, i) => (
        <option
          data-key={option.key}
          value={option.value}
          selected={option.selected}
          disabled={i === 0}
          key={`dd_type_${i}`}
        >
          {option.value}
        </option>
      ))}
    </select>  
  )
}

export default DropDown;