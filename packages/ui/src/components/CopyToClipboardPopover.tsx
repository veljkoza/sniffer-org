/* eslint-disable @typescript-eslint/no-namespace */
import { Popover, Transition } from '@headlessui/react';
import { FC, Fragment, ReactNode } from 'react';
import { Icons } from '../icons';
import { useClipboard } from '../hooks';

namespace CopyToClipboardPopoverTypes {
  export type Props = {
    render?: ({
      onCopy,
    }: {
      onCopy: (content: string) => void;
      content: string;
    }) => ReactNode;
    content: string;
  };
}

const CopyToClipboardPopover: FC<CopyToClipboardPopoverTypes.Props> = ({
  content,
  render,
}) => {
  const { copyContent } = useClipboard();

  const renderCopyButton = () => {
    if (render) return render({ onCopy: copyContent, content });

    return (
      <Icons.Copy
        className="text-primary h-10 w-10"
        onClick={() => copyContent(content)}
      />
    );
  };

  return (
    <Popover>
      {() => (
        <Popover.Button className="relative">
          {renderCopyButton()}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute bg-white shadow-lg text-primary left-1/2 z-10 mt-3 -translate-x-1/2 transform p-3 rounded-xl">
              <p>Copied!</p>
            </Popover.Panel>
          </Transition>
          {/* </button> */}
        </Popover.Button>
      )}
    </Popover>
  );
};

export { CopyToClipboardPopover };
