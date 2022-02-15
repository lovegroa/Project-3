import React from 'react';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import qCategories from './qCategories'

const animatedComponents = makeAnimated();

export default function AnimatedMulti() {

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={[qCategories[1], qCategories[0]]}
      isMulti
      options={qCategories}
    />
  );
}