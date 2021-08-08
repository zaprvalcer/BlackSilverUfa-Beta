import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Utils
import padStart from 'lodash/padStart';
// Components
import { Button, Col, Form, InputGroup, Popover } from 'react-bootstrap';
// Namespace
import { BASE } from '../../constants/urls';
import { videoPage as t } from '../../constants/texts';

const formatTime = (seconds) => [2, 1, 0].map((key, index, source) => {
  const unit = 60 ** key;
  const prevUnit = 60 ** source[index - 1];

  const value = prevUnit ? seconds % prevUnit : seconds;
  const result = Math.floor(value / unit);

  return padStart(result, 2, '0');
}).join(':');

const generateUrl = ({
  includeTime,
  game,
  segment,
  offset,
  timecode,
}) => {
  const baseUrl = `${BASE}/${game}/${segment}`;

  return includeTime ? `${baseUrl}?at=${timecode + offset}` : baseUrl;
};

const ShareOverlay = ({
  game,
  segment,
  offset,
  currentTime,
  ...otherProps
}) => {
  const inputRef = React.useRef();
  const timecode = Math.floor(currentTime);
  const [includeTime, setIncludeTime] = useState(true);

  const formattedTime = formatTime(timecode);
  const url = generateUrl({ includeTime, game, segment, timecode, offset });

  const handleIncludeToggle = ({ target }) => setIncludeTime(target.checked);
  const handleCopyClick = () => {
    const input = inputRef.current;

    if (!input) return;

    input.select();
    input.setSelectionRange(0, 200);
    document.execCommand('copy');
  };

  return (
    <Popover {...otherProps} className="share-popover">
      <Popover.Title as="h3">{t.linkCreationTitle}</Popover.Title>
      <Popover.Content>
        <Form.Row>
          <Col>
            <InputGroup>
              <Form.Control ref={inputRef} readOnly value={url} />
              <InputGroup.Append>
                <Form.Control
                  as={Button}
                  variant="dark"
                  onClick={handleCopyClick}
                >
                  <i className="fas fa-copy" />
                </Form.Control>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Row>

        <Form.Row className="mt-2">
          <Col className="d-flex align-content-center">
            <Form.Check
              className="mr-2"
              type="checkbox"
              label={t.timeCodeLabel}
              checked={includeTime}
              onChange={handleIncludeToggle}
            />

            <Form.Control
              className="time-selector"
              value={formattedTime}
              size="sm"
              readOnly
              htmlSize={4}
            />
          </Col>
        </Form.Row>
      </Popover.Content>
    </Popover>
  );
};

ShareOverlay.propTypes = {
  game: PropTypes.string.isRequired,
  segment: PropTypes.string.isRequired,
  offset: PropTypes.string.isRequired,
  currentTime: PropTypes.string.isRequired,
};

export default ShareOverlay;
