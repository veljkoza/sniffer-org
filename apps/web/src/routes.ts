export const ROUTES = {
  index: {
    root: '/',
  },
  recording: {
    root: '/recording',
    details: {
      template: ':id',
      get(id: string) {
        return `/recording/${id}`;
      },
    },
  },
};
