import { ReactNode, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace TabsTypes {
  type TabHeaderData<K> = {
    key: K;
    label: string;
  };
  export interface Props<T extends { [k: string]: any }, K extends keyof T> {
    tabs: Record<K, { label: string; component: ReactNode }>;
    initialSelectedTab?: K;
    className?: string;
    onTabChange?: (newTab: K) => void;
    renderHeader?: (
      data: (TabHeaderData<K> & {
        isActive: boolean;
        onSelected: (key: K) => void;
      })[]
    ) => ReactNode;
  }

  export interface HeaderProps<K> {
    data: (TabHeaderData<K> & {
      isActive: boolean;
      onSelected: (key: K) => void;
    })[];
  }
}

const Tabs = <T extends { [k: string]: any }, K extends keyof T>({
  tabs,
  initialSelectedTab,
  className,
  onTabChange,
  renderHeader,
}: TabsTypes.Props<T, K>) => {
  const getInitialSelectedTab = () => {
    if (initialSelectedTab) return initialSelectedTab;
    const keys = Object.keys(tabs);
    if (keys.length > 0) return keys[0] as K;
  };

  const [selectedTab, setSelectedTab] = useState<K | undefined>(
    getInitialSelectedTab()
  );

  const selectTab = (key: K) => {
    console.log({ key });
    setSelectedTab(key);
    onTabChange?.(key);
  };

  const headerData = Object.keys(tabs).map((key) => ({
    key: key as K,
    label: tabs[key as K].label,
    isActive: key === selectedTab,
    onSelected: selectTab,
  }));

  const renderHeaderComponent = () => {
    if (renderHeader) {
      return renderHeader(headerData);
    }
    return <Tabs.Header data={headerData} />;
  };

  console.log({ selectedTab });

  return (
    <div className={twMerge('flex flex-col', className)}>
      {renderHeaderComponent()}
      <div className="h-full flex-1">{tabs[selectedTab as K]?.component}</div>
    </div>
  );
};

const TabsHeader = <K,>({ data }: TabsTypes.HeaderProps<K>) => {
  return (
    <header className="flex">
      {data.map((tab) => (
        <button
          onClick={() => tab.onSelected(tab.key)}
          className={twMerge(
            'p-3  flex-1',
            tab.isActive
              ? 'bg-black text-white'
              : 'text-black bg-white hover:bg-gray-400'
          )}
        >
          {tab.label}
        </button>
      ))}
    </header>
  );
};

Tabs.Header = TabsHeader;

export { Tabs, TabsTypes };
