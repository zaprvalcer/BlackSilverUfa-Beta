import React from 'react';
import PropTypes from 'prop-types';
// Components
import { ListGroup } from 'react-bootstrap';

const DescriptionLink = ({
  icon,
  label,
  link,
  note,
  children,
  ...rest
}) => (
  <ListGroup.Item>
    {`${label}: `}
    <a {...rest}>
      <i className={icon} />
      <span>{link}</span>
    </a>
    {note && ` (${note})`}
    {children}
  </ListGroup.Item>
);

DescriptionLink.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  note: PropTypes.string,
};

DescriptionLink.defaultProps = {
  note: null,
};

export default DescriptionLink;
