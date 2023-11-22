export const ROUTES = {
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
