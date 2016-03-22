///<reference path="tsd.d.ts"/>
import components from './components/loader';
import services from './services/loader';
import GreetingService from './services/greeterService';

const app = angular.module('miQStaticAssets', []);
components(app);
services(app);
