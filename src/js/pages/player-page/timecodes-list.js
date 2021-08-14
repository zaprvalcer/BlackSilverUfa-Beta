import React from 'react';
import PropTypes from 'prop-types';
// Utils
import classNames from 'classnames';
// Components
import { ListGroup } from 'react-bootstrap';
import TimecodesItem from './timecodes-item';
import TimecodesSection from './timecodes-section';

const isSimpleItem = (value) => typeof value === 'string' || Array.isArray(value);

const TimecodesList = ({ data, level, ...rest }) => (
  <ListGroup className={classNames('timecodes-list', `timecodes-nested-${level}`)}>
    {Object.entries(data).map(([key, value]) => (isSimpleItem(value)
      ? (
        <TimecodesItem
          key={key}
          {...rest}
          label={Array.isArray(value) ? key : value}
          timecodes={Array.isArray(value) ? value : [key]}
        />
      )
      : (
        <TimecodesSection key={value} name={key}>
          <TimecodesList
            {...rest}
            data={value}
            level={level + 1}
          />
        </TimecodesSection>
      )))}
  </ListGroup>
);

TimecodesList.defaultProps = {
  level: 0,
};

TimecodesList.propTypes = {
  level: PropTypes.number,
  data: PropTypes.object.isRequired,
  currentTime: PropTypes.number.isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

export default TimecodesList;
