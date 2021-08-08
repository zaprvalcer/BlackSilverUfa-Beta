import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import ShareOverlay from './share-overlay';
// Namespace
import { videoPage as t } from '../../constants/texts';

const PlayerControls = ({ game, segment, offset, currentTime, onFullScreenToggle }) => (
  <Row className="no-gutters">
    <Col>
      <div className="player-controls border-top border-bottom">
        <div className="flex-grow-1" />

        <OverlayTrigger
          trigger="click"
          rootClose
          placement="top"
          overlay={(
            <ShareOverlay
              game={game}
              offset={offset}
              segment={segment}
              currentTime={currentTime}
            />
          )}
        >
          <Button variant="dark" size="sm" className="mr-2">
            <i className="fas fa-share-square" />
            <span>{t.shareButton}</span>
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={(props) => (
            <Tooltip {...props}>
              {t.fullScreenTooltip}
            </Tooltip>
          )}
        >
          <Button variant="dark" size="sm" onClick={onFullScreenToggle}>
            <i className="fas fa-expand" />
            <span>{t.fullScreenButton}</span>
          </Button>
        </OverlayTrigger>
      </div>
    </Col>
  </Row>
);

PlayerControls.propTypes = {
  game: PropTypes.string.isRequired,
  segment: PropTypes.string.isRequired,
  offset: PropTypes.string.isRequired,
  currentTime: PropTypes.string.isRequired,
  onFullScreenToggle: PropTypes.func.isRequired,
};

export default PlayerControls;
