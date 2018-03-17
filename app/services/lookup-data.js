import Service from '@ember/service';

export default Service.extend({
  street: null,
  zip: null,
  districtsToPickFrom: null,

  clear() {
    this.setProperties({
      street: null,
      zip: null,
      districtsToPickFrom: null
    });
  }
});
