import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export function startPlaceholder(linkName) {
  return `start-${linkName}`;
}

export function endPlaceholder(linkName) {
  return `end-${linkName}`;
}

export default Component.extend({
  key: null,
  links: null,
  intl: service(),

  startLink(url) {
    return `<a href="${url}" target="_blank" data-test-translate-link>`;
  },

  endLink() {
    return '</a>';
  },

  translation: computed('key', 'links', function() {
    const context = {};
    const key = this.get('key');
    const links = this.get('links');

    if (key === undefined || key === null) {
      return 'ERROR: Must provide key parameter to translate-format-link';
    }

    if (links === undefined || links === null) {
      return 'ERROR: Must provide links parameter to translate-format-link';
    }

    const linkNames = Object.keys(links);

    linkNames.forEach(linkName => {
      context[`link-${linkName}`] = startPlaceholder(linkName);
      context[`/link-${linkName}`] = endPlaceholder(linkName);
    })

    if (!this.get('intl').exists(key)) {
      return `Missing translation: ${key}`;
    }

    let translatedText;

    try {
      translatedText = this.get('intl').t(key, context).toString();
    } catch (err) {
      return err.toString();
    }

    linkNames.forEach(linkName => {
      const linkUrl = links[linkName];

      translatedText = translatedText
        .replace(startPlaceholder(linkName), this.startLink(linkUrl))
        .replace(endPlaceholder(linkName), this.endLink());
    });

    return htmlSafe(translatedText);
  })
});
