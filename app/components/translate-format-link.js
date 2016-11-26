import Ember from 'ember';

export function startPlaceholder(linkName) {
  return `start-${linkName}`;
}

export function endPlaceholder(linkName) {
  return `end-${linkName}`;
}

export default Ember.Component.extend({
  classNames: ['translate-format-link'],

  key: null,
  links: null,

  i18n: Ember.inject.service(),

  startLink(url) {
    return `<a href="${url}" target="_blank" class="translate-format-link__link">`;
  },

  endLink() {
    return '</a>';
  },

  translation: Ember.computed('key', 'links', function() {
    const context = {};
    const key = this.get('key');
    const links = this.get('links');

    if (key === undefined || key === null) {
      return 'ERROR: Must provide key parameter to translate-format-link';
    }

    if (links === undefined || links === null) {
      return 'ERROR: Must provide links parameter to translate-format-link';
    }

    for (let linkName in links) {
      context[`link-${linkName}`] = startPlaceholder(linkName);
      context[`/link-${linkName}`] = endPlaceholder(linkName);
    }

    let translatedText = this.get('i18n').t(key, context).toString();

    for (let linkName in links) {
      const linkUrl = links[linkName];

      translatedText = translatedText
        .replace(startPlaceholder(linkName), this.startLink(linkUrl))
        .replace(endPlaceholder(linkName), this.endLink());
    }

    return Ember.String.htmlSafe(translatedText);
  })
});
