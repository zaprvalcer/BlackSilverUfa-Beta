import React from 'react';
import PropTypes from 'prop-types';
// Utils
import classNames from 'classnames';
import reverse from 'lodash/reverse';

const toSeconds = (time) => reverse(time.split(':'))
  .reduce((accumulator, value, index) => accumulator + value * (60 ** index), 0);

const TimecodeLink = ({ time, currentTime, onTimeChange }) => {
  const timestamp = toSeconds(time);
  const isVisited = currentTime >= timestamp;

  const handleCLick = (event) => {
    event.preventDefault();
    onTimeChange(timestamp);
  };

  return (
    <button
      type="button"
      onClick={handleCLick}
      className={classNames('nav-button', { visited: isVisited })}
    >
      {time}
    </button>
  );
};

TimecodeLink.propTypes = {
  time: PropTypes.string.isRequired,
  currentTime: PropTypes.string.isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

export default TimecodeLink;
