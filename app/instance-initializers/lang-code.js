export function initialize(appInstance) {
  const i18nService = appInstance.lookup('service:i18n');

  if (i18nService && i18nService.get('locale')) {
    document.documentElement.setAttribute('lang', i18nService.get('locale'));
  }
}

export default {
  initialize
};
