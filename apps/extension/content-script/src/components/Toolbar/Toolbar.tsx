import { PropsWithChildren } from 'react';
const Toolbar = (props: PropsWithChildren) => {
  return (
    <div className="bg-toolbar-bg shadow-lg fixed px-8 py-4 rounded-xl text-white bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
      {props.children}
    </div>
  );
};

export { Toolbar };
