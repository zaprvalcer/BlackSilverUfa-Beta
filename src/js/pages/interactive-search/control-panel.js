import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Dropdown from './dropdown';
import DateFilter from './date-filter';
import Select from './select';
// Namespace
import t from '../../constants/texts';
import { MODES } from './constants';

const SORT_OPTIONS = {
  segments: ['date'],
  games: ['date', 'stream_count'],
};

const SORT_ICONS = {
  desc: 'fa-sort-amount-down',
  asc: 'fa-sort-amount-up',
};

const STYLE_CONFIG = {
  xs: 12,
  sm: 8,
  md: 6,
  lg: 4,
};

const ControlPanel = ({ mode,
  filters,
  sorting,
  segments,
  categories,
  onSubmit,
  onChange,
  onQueryChange,
}) => {
  const direction = sorting.desc ? 'desc' : 'asc';

  return (
    <Row className="interactive-search-form">
      <Col>
        <Card className="w-100 h-0 pl-3 pr-3 pt-3 pb-2">
          <Form onSubmit={onSubmit}>
            <InputGroup>
              <InputGroup.Prepend>
                <Dropdown
                  value={mode}
                  options={MODES}
                  variant="success"
                  labels={t.mainPage.modes}
                  onChange={(input) => onChange({
                    mode: { $set: input },
                    sorting: {
                      mode: { $set: 'date' },
                    },
                  })}
                />
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                onChange={({ target }) => onQueryChange(target.value)}
                placeholder={t.mainPage.queryPlaceholder}
                onKeyPress={(event) => event.code === 'Enter' && onSubmit(event)}
              />
              <InputGroup.Append>
                <Button variant="primary" onClick={onSubmit}>{t.mainPage.search}</Button>
              </InputGroup.Append>
            </InputGroup>
            <Form.Row>
              { mode === 'segments'
                ? (
                  <DateFilter
                    {...STYLE_CONFIG}
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    segments={segments}
                    onChange={(input) => onChange({ filters: { $merge: input } })}
                  />
                )
                : (
                  <Select
                    {...STYLE_CONFIG}
                    value={filters.category}
                    label={t.mainPage.category}
                    labels={categories}
                    options={Object.keys(categories)}
                    onChange={(category) => onChange({ filters: { $merge: { category } } })}
                  />
                )}
              <Select
                {...STYLE_CONFIG}
                value={sorting.mode}
                label={t.mainPage.sorting}
                labels={t.mainPage.sortModes}
                options={SORT_OPTIONS[mode]}
                iconClassName={SORT_ICONS[direction]}
                onIconClick={() => onChange({ sorting: { $toggle: ['desc'] } })}
                onChange={(input) => onChange({ sorting: { $merge: { mode: input } } })}
              />
            </Form.Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

ControlPanel.propTypes = {
  mode: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  segments: PropTypes.object,
  categories: PropTypes.object,

  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onQueryChange: PropTypes.func.isRequired,
};

ControlPanel.defaultProps = {
  segments: null,
  categories: null,
};

export default ControlPanel;
