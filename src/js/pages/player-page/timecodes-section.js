import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, ListGroupItem } from 'react-bootstrap';
import { useToggleState } from '../../hooks/use-toggle-state';

const TimecodesSection = ({ name, children }) => {
  const [isOpen, toggleOpen] = useToggleState(true);
  const iconClass = isOpen ? 'fa-chevron-down' : 'fa-chevron-right';

  return (
    <>
      <ListGroupItem
        className="d-flex"
        action
        onClick={toggleOpen}
      >
        <i className={`glyph fas ${iconClass}`} />
        <b>{name}</b>
      </ListGroupItem>
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </>
  );
};

TimecodesSection.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TimecodesSection;
