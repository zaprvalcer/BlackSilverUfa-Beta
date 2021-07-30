import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import flow from 'lodash/flow';
import { Data } from '../../data';
import config from '../../../../config/config.json';
import updateState from '../../utils/update-state';
import BasePage from '../../components/base-page';
import t from '../../constants/texts';
import BigSpinner from '../../components/big-spinner';
// Utils
import Matomo from '../../matomo';
// Components
import ControlPanel from './control-panel';
import SearchResults from './search-results';
import { filterByText, tokenize } from '../../utils/search';

const convertCategories = (data) => Object.values(data)
  .filter(({ search }) => search !== false)
  .reduce((result, current) => {
    result[current.id] = current.name;
    return result;
  }, { any: t.mainPage.categoryAny });

const getDateParams = (startDate, endDate) => (endDate
  ? { $between: [startDate, endDate] }
  : { $dteq: startDate });

const getGamesFlow = (index, category) => flow([
  () => index.chain(),
  (chain) => (category === 'any' ? chain : chain.find({ 'category.id': category })),
  (chain) => chain.where((item) => item.category.search !== false),
]);

const getSegmentsFlow = (segments, startDate, endDate) => flow([
  () => segments.chain(),
  (chain) => (startDate ? chain.find({ date: getDateParams(startDate, endDate) }) : chain),
  (chain) => chain.find({ games: { $size: { $gt: 0 } } }),
]);

const getSortFlow = (chain, sortMode, desc) => {
  const sortParams = sortMode === 'date'
    ? [['date', desc], ['segment', desc]]
    : [['streams', desc], ['date', desc], ['segment', desc]];

  return chain.compoundsort(sortParams);
};

const executeSearch = ({ mode, data, text, category, startDate, endDate, sortMode, desc }) => flow([
  mode === 'segments'
    ? getSegmentsFlow(data.segments, startDate, endDate)
    : getGamesFlow(data.index, category),
  (chain) => getSortFlow(chain, sortMode, desc),
  (chain) => (tokenize(text).length ? filterByText(text, chain.data()) : chain.data()),
])();

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
    event?.preventDefault();

    const { mode, data, sorting: { mode: sortMode, desc }, filters } = this.state;

    const results = executeSearch({ mode, data, ...filters, sortMode, desc });

    if (event && tokenize(filters.text).length) {
      Matomo.trackSiteSearch({
        keyword: filters.text,
        category: mode,
        count: results.length,
      });
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

  render() {
    const { data, loaded, mode, results, filters, sorting } = this.state;

    if (!loaded) {
      return <BigSpinner />;
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
        <ControlPanel
          mode={mode}
          filters={filters}
          sorting={sorting}
          segments={data.segments}
          categories={data.categories}
          onSubmit={this.submitForm}
          onChange={(input) => updateState(this, input, this.submitForm)}
          onQueryChange={(input) => updateState(this, { filters: { text: { $set: input } } })}
        />
        {!!results.mode && (
          <SearchResults
            mode={results.mode}
            items={results.items}
            page={results.page}
            segments={data.segments}
            onPageChange={(input) => updateState(this, { results: { page: { $set: input } } })}
          />
        )}
      </BasePage>
    );
  }
}

export default InteractiveSearch;
