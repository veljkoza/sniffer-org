import { Popover, Transition } from '@headlessui/react';
import { Icons } from '../../../shared/icons';
import { VariantProps, cva } from 'cva';
import { twMerge } from 'tailwind-merge';
import { Fragment, useState } from 'react';
import { useClipboard } from '../../../shared/hooks';

const urlContainerVariants = cva([
  'bg-white',
  'border-black',
  'border-2',
  'p-8',
  'rounded-xl',
  'text-center',
  'flex items-center justify-between gap-4',
]);
export type TUrlContainerProps = VariantProps<typeof urlContainerVariants>;

const UrlContainer = (props: { className?: string; url: string }) => {
  const classNames = twMerge(urlContainerVariants(), props.className);

  const { copyContent } = useClipboard();

  return (
    <div className={classNames}>
      <a
        href={props.url}
        target="_blank"
        className="text-black whitespace-nowrap cursor-pointer underline text-xl underline-offset-4"
        rel="noreferrer"
      >
        {props.url}
      </a>
      <Popover>
        {() => (
          <Popover.Button className="relative">
            <Icons.Copy
              className="text-primary h-10 w-10"
              onClick={() => copyContent(props.url)}
            />

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
    </div>
  );
};

export { UrlContainer };
