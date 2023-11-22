import { frontendServicesFactory } from '@sniffer/frontend-services';

const API_URL = import.meta.env.VITE_API_URL;

const frontendServices = frontendServicesFactory(API_URL);

export { frontendServices };
