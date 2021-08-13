import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DescriptionLink from './description-link';
// Utils
import Sugar from '../../utils/sugar';
import { interpolate } from '../../utils/text';
// Namespace
import { PATHS, TWITCH, YOUTUBE } from '../../constants/urls';
import { videoPage as t } from '../../constants/texts';

const Description = ({
  game,
  stream,
  part,
}) => {
  const { segment, date, youtube, official, direct, torrent } = stream;

  const gameUrl = interpolate(PATHS.GAME, { game: game.id });
  const streamDate = Sugar.Date.medium(date);
  const streamAge = Sugar.Date.relative(date);

  return (
    <Row className="stream-description">
      <Col>
        <h3>
          <Link to={gameUrl}>{game.name}</Link>
          <span> — </span>
          <span className="flex-grow-1">{part}</span>
        </h3>

        <ListGroup variant="flush" size="sm">
          <ListGroup.Item>
            {`${t.streamDateLabel}: ${streamDate} (${streamAge})`}
          </ListGroup.Item>

          {segment.startsWith('00') ? (
            <ListGroup.Item>{`${t.streamId}: `}<code>{segment}</code></ListGroup.Item>
          ) : (
            <DescriptionLink
              target="blank"
              icon="fab fa-twitch"
              link={t.twitch}
              label={t.streamSourceLabel}
              href={`${TWITCH}/${segment}`}
            >
              {` (${t.id}: `}<code>{segment}</code>)
            </DescriptionLink>
          )}

          {youtube ? (
            <DescriptionLink
              target="blank"
              icon="fab fa-youtube"
              link={t.youtube}
              label={t.recordSourceLabel}
              href={`${YOUTUBE}/${youtube}`}
              note={official === false ? t.nonOfficialChannel : t.officialChannel}
            />
          ) : (
            <DescriptionLink
              icon="fas fa-link"
              link={t.directLink}
              label={t.recordSourceLabel}
              href={direct}
            />
          )}

          {torrent && (
            <DescriptionLink
              icon="fas fa-download"
              link={t.downloadButton}
              label={t.torrent}
              href={torrent}
            />
          )}
        </ListGroup>
      </Col>
    </Row>
  );
};

Description.propTypes = {
  game: PropTypes.object.isRequired,
  stream: PropTypes.object.isRequired,
  part: PropTypes.string.isRequired,
};

export default Description;
