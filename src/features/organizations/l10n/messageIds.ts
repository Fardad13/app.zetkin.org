import { m, makeMessages } from 'core/i18n';

export default makeMessages('feat.organizations', {
  page: {
    title: m('Select organization:'),
  },
  sidebar: {
    allOrganizations: m('All organizations'),
    filter: {
      noResults: m('No organizations matching this filter'),
      topLevel: m('Top level organization'),
    },
    filtered: m('Filtered'),
    recent: {
      clear: m('Clear'),
      title: m('Recent organizations'),
    },
  },
});
