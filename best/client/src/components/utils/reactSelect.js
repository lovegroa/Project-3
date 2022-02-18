import React, { useState } from 'react';

import Select from 'react-select';
import qCategories from './qCategories'


export function MultiSelect({ setSelected }) {

  const [ value, setValue ] = useState('')

  const onChange = (option) => {
    setValue(option)
    setSelected(option)
  }

  return (
    <Select
      {...{ value, onChange }}  
      defaultValue={[qCategories[2], qCategories[3]]}
      isMulti
      name="category-search"
      options={qCategories}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  )
}


export default function SingleSelect({ setSelected }) {

  const [ value, setValue ] = useState('')

  const onChange = (option) => {
    setValue(option)
    setSelected(option)
  }


  return (
    <Select
      {...{ value, onChange }}
      closeMenuOnSelect={false}
      defaultValue={qCategories[1]}
      name='categories'
      options={qCategories}
    />
  );
}