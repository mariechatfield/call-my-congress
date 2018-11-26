export function initialize(appInstance) {
  const intlService = appInstance.lookup('service:intl');

  if (intlService && intlService.get('locale')) {
    document.documentElement.setAttribute('lang', intlService.get('locale'));
  }
}

export default {
  initialize
};
