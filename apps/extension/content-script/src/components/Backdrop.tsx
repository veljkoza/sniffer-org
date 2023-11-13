import { FC } from 'react';

const Backdrop: FC<{ onClick?: () => void }> = (props) => {
  return (
    <aside
      onClick={() => props.onClick?.()}
      className="fixed inset-0 h-full w-full bg-black bg-opacity-50"
    />
  );
};

export { Backdrop };
