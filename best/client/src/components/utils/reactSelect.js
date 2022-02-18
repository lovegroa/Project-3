import React, { useState } from 'react';

import Select from 'react-select';
import qCategories from './qCategories'

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