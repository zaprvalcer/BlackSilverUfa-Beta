import React from 'react';
import PropTypes from 'prop-types';
// Components
import TimecodesList from './timecodes-list';
import { AutoScroll } from '../../components';
// Namespace
import { videoPage as t } from '../../constants/texts';

const TimecodesPanel = ({ data, ...rest }) => (
  <>
    <div className="sidebar-header">
      {t.timecodesTitle}
    </div>
    <AutoScroll flex="1 1 0">
      <TimecodesList data={data} {...rest} />
    </AutoScroll>
  </>
);

TimecodesPanel.defaultProps = {
  currentTime: 0,
  onTimeChange: () => null,
};

TimecodesPanel.propTypes = {
  currentTime: PropTypes.number,
  onTimeChange: PropTypes.func,
  data: PropTypes.object.isRequired,
};

export default TimecodesPanel;
