import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Components
import { Button, Form, InputGroup } from 'react-bootstrap';
// Namespace
import t from '../../constants/texts';

const TextFilter = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  return (
    <>
      <Form.Control
        type="text"
        value={value}
        placeholder={t.mainPage.queryPlaceholder}
        onChange={({ target }) => setValue(target.value)}
        onKeyPress={(event) => event.code === 'Enter' && onSubmit(value)}
      />
      <InputGroup.Append>
        <Button variant="primary" onClick={() => onSubmit(value)}>{t.mainPage.search}</Button>
      </InputGroup.Append>
    </>
  );
};

TextFilter.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default TextFilter;
