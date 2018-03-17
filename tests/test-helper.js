import resolver from './helpers/resolver';
import { start, setResolver } from 'ember-qunit';

setResolver(resolver);
start();