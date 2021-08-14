import React from 'react';
import PropTypes from 'prop-types';
// Components
import { ListGroup } from 'react-bootstrap';
import TimecodeLink from './timecode-link';

const TimecodesItem = ({ label, timecodes, ...rest }) => (
  <ListGroup.Item>
    {timecodes.map((current, index) => {
      const [startTime, endTime] = current.split('~');
      return (
        <>
          {!!index && ', '}
          <TimecodeLink time={startTime} {...rest} />
          {endTime && ' - '}
          {endTime && <TimecodeLink time={endTime} {...rest} />}
        </>
      );
    })}
    <span dangerouslySetInnerHTML={{ __html: ` — ${label}` }} />
  </ListGroup.Item>
);

TimecodesItem.propTypes = {
  label: PropTypes.string.isRequired,
  timecodes: PropTypes.array.isRequired,
};

export default TimecodesItem;
