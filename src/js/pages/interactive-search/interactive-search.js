import React from 'react';
import animateScrollTo from 'animated-scroll-to';
import { Row, Col, Alert } from 'react-bootstrap';
import { Data } from '../../data';
import fts, { tokenize } from '../../utils/full-text-search';
import config from '../../../../config/config.json';
import updateState from '../../utils/update-state';
import BasePage from '../../components/base-page';
import t from '../../constants/texts';
import BigSpinner from '../../components/big-spinner';
import Matomo from '../../matomo';
// Components
import ControlPanel from './control-panel';
import SearchResults from './search-results';

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
