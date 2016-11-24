import Ember from 'ember';

export default Ember.Component.extend({
  key: null,
  links: null,

  i18n: Ember.inject.service(),

  startLink(url) {
    return `<a href="${url}" target="_blank">`;
  },

  endLink() {
    return '</a>';
  },

  translation: Ember.computed('key', 'links.[]', function() {
    const context = {};
    const links = this.get('links');

    for (let linkName in links) {
      context[`link-${linkName}`] = `start-${linkName}`;
      context[`/link-${linkName}`] = `end-${linkName}`;
    }

    let translatedText = this.get('i18n').t(this.get('key'), context).toString();

    for (let linkName in links) {
      const linkUrl = links[linkName];

      translatedText = translatedText
        .replace(`start-${linkName}`, this.startLink(linkUrl))
        .replace(`end-${linkName}`, this.endLink());
    }

    return Ember.String.htmlSafe(translatedText);
  })
});
