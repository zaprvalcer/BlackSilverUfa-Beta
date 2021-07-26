import React from 'react';
import animateScrollTo from 'animated-scroll-to';
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Alert,
  Card,
} from 'react-bootstrap';

import { Data } from '../../data';
import fts, { tokenize } from '../../utils/full-text-search';
import config from '../../../../config/config.json';
import updateState from '../../utils/update-state';
import DateFilter from './date-filter';
import BasePage from '../../components/base-page';
import t from '../../constants/texts';
import {
  SegmentsList,
  GamesList,
  ResultsPagination,
} from '../../components/search/results';
import BigSpinner from '../../components/big-spinner';
import Matomo from '../../matomo';
// Components
import Select from './select';
import Dropdown from './dropdown';

const MODES = ['segments', 'games'];
const SORT_OPTIONS = {
  segments: ['date'],
  games: ['date', 'stream_count'],
};

const SORT_ICONS = {
  desc: 'fa-sort-amount-down',
  asc: 'fa-sort-amount-up',
};

const convertCategories = (data) => Object.values(data)
  .filter(({ search }) => search !== false)
  .reduce((result, current) => {
    result[current.id] = current.name;
    return result;
  }, { any: t.mainPage.categoryAny });

class InteractiveSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      mode: 'segments',
      data: {
        segments: null,
        categories: null,
        games: null,
      },
      filters: {
        text: '',
        category: 'any',
        startDate: null,
        endDate: null,
      },
      sorting: {
        mode: 'date',
        desc: true,
      },
      results: {
        mode: null,
        items: [],
        page: 0,
      },
    };

    this.submitForm = this.submitForm.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  loadData() {
    return Data.then(({ segments, categories, index }) => {
      updateState(this, {
        data: { $merge: { index, segments, categories: convertCategories(categories.data) } },
        loaded: { $set: true },
      });
    });
  }

  async componentDidMount() {
    await this.loadData();
    document.title = `Главная страница | ${config.title}`;
    Matomo.trackPageView();
    this.submitForm();
  }

  submitForm(event) {
    if (event) {
      event.preventDefault();
    }

    const { mode, data: { segments, index }, filters } = this.state;
    let chain;

    if (mode === 'segments') {
      chain = segments.chain();

      {
        const { filters: { startDate, endDate } } = this.state;

        if (startDate) {
          if (endDate) {
            chain = chain.find({
              date: { $between: [startDate, endDate] },
            });
          } else {
            chain = chain.find({ date: { $dteq: startDate } });
          }
        }
      }

      chain = chain.find({ games: { $size: { $gt: 0 } } });
    } else if (mode === 'games') {
      chain = index.chain();

      const { category } = filters;
      if (category !== 'any') {
        chain = chain.find({ 'category.id': category });
      }

      chain = chain.where((item) => item.category.search !== false);
    }

    {
      const { sorting: { mode: sortMode, desc } } = this.state;

      if (sortMode === 'date') {
        chain = chain.compoundsort([['date', desc], ['segment', desc]]);
      } else if (sortMode === 'stream_count' && mode === 'games') {
        chain = chain.compoundsort([['streams', desc], ['date', desc], ['segment', desc]]);
      }
    }

    let results = chain.data();

    {
      const { filters: { text } } = this.state;

      if (tokenize(text).length > 0) {
        results = fts(text, results, ({ name }) => name);

        if (event) {
          Matomo.trackSiteSearch({
            keyword: text,
            category: mode,
            count: results.length,
          });
        }
      }
    }

    updateState(this, {
      results: {
        $merge: {
          mode,
          items: results,
          page: 0,
        },
      },
    });
  }

  filters() {
    const {
      data: { segments, categories },
      mode, filters, sorting,
    } = this.state;

    const components = [];

    if (mode === 'segments') {
      components.push(
        <DateFilter
          key="date"
          startDate={filters.startDate}
          endDate={filters.endDate}
          segments={segments}
          onChange={(input) => updateState(this, { filters: { $merge: input } }, this.submitForm)}
        />,
      );
    } else if (mode === 'games') {
      components.push(<Select
        xs={12}
        sm={8}
        md={6}
        lg={4}
        key="category"
        value={filters.category}
        label={t.mainPage.category}
        labels={categories}
        options={Object.keys(categories)}
        onChange={(input) => updateState(this, {
          filters: { category: { $set: input } },
        }, this.submitForm)}
      />);
    }

    const direction = sorting.desc ? 'desc' : 'asc';

    components.push(
      <Select
        xs={12}
        sm={8}
        md={6}
        lg={4}
        key="sorting"
        value={sorting.mode}
        label={t.mainPage.sorting}
        labels={t.mainPage.sortModes}
        options={SORT_OPTIONS[mode]}
        iconClassName={SORT_ICONS[direction]}
        onIconClick={() => updateState(this, {
          sorting: { $toggle: ['desc'] },
        }, this.submitForm)}
        onChange={(input) => updateState(this, {
          sorting: { mode: { $set: input } },
        }, this.submitForm)}
      />,
    );

    return <Form.Row>{components}</Form.Row>;
  }

  inputForm() {
    const { mode } = this.state;

    return (
      <Form onSubmit={this.submitForm}>
        <InputGroup>
          <InputGroup.Prepend>
            <Dropdown
              value={mode}
              options={MODES}
              variant="success"
              labels={t.mainPage.modes}
              onChange={(input) => updateState(this, {
                mode: { $set: input },
                sorting: {
                  mode: { $set: 'date' },
                },
              }, this.submitForm)}
            />
          </InputGroup.Prepend>
          <Form.Control
            onChange={(event) => updateState(this, {
              filters: { text: { $set: event.target.value } },
            })}
            onKeyPress={(event) => { if (event.code === 'Enter') this.submitForm(event); }}
            type="text"
            placeholder="Поиск по названию"
          />
          <InputGroup.Append>
            <Button variant="primary" onClick={this.submitForm}>Найти</Button>
          </InputGroup.Append>
        </InputGroup>
        {this.filters()}
      </Form>
    );
  }

  onPageChange(newPage) {
    updateState(this, {
      results: {
        page: { $set: newPage },
      },
    });

    animateScrollTo(0);
  }

  render() {
    const { data, loaded, results: { items, page, mode } } = this.state;

    if (!loaded) {
      return <BigSpinner />;
    }

    let renderer = null;
    if (mode === 'segments') {
      renderer = SegmentsList;
    } if (mode === 'games') {
      renderer = GamesList;
    }

    return (
      <BasePage>
        <Row className="pt-3">
          <Col>
            <Alert variant="dark">
              Поиск ещё находится на стадии разработки. Я планирую добавить больше
              фильтров, сортировку результатов и доработать оформление :)
            </Alert>
          </Col>
        </Row>
        <Row className="interactive-search-form">
          <Col>
            <Card className="w-100 h-0 pl-3 pr-3 pt-3 pb-2">
              {this.inputForm()}
            </Card>
          </Col>
        </Row>
        {renderer ? (
          <ResultsPagination
            items={items}
            page={page}
            onPageChange={this.onPageChange}
            max={10}
            renderer={renderer}
            rendererProps={{ data: { ...data } }}
          />
        ) : null}
      </BasePage>
    );
  }
}

export default InteractiveSearch;
