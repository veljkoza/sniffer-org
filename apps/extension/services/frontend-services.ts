import { frontendServicesFactory } from '@sniffer/frontend-services';
const test = import.meta as any;
const env = test.env;
console.log({ test });
const API_URL = 'http://localhost:4000';
const frontendServices = frontendServicesFactory(API_URL);

export { frontendServices };
