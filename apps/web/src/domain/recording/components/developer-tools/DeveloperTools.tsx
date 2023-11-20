import { PropsWithChildren, useState } from 'react';
import { DeveloperToolsTable } from './table';
import { Tabs, TabsTypes } from '../../../../shared/components/tabs/Tabs';
import { twMerge } from 'tailwind-merge';
type HttpHeader = {
  name: string;
  value: string;
};
/* eslint-disable @typescript-eslint/no-namespace */
namespace DeveloperToolsTypes {
  export type TableData = {
    name: string;
    method: string;
    status: number;
    type: string;
    domain: string;
    duration: string;
    payload: any;
    requestHeaders: HttpHeader[];
    responseHeaders: HttpHeader[];
    response: any;
    url: string;
  };
  export type Props = {
    data: TableData[];
  };
}

const DeveloperTools = ({ data }: DeveloperToolsTypes.Props) => {
  const [selectedRequest, setSelectedRequest] =
    useState<DeveloperToolsTypes.TableData>();

  const openRequestDetails = (request: DeveloperToolsTypes.TableData) => {
    setSelectedRequest(request);
  };

  console.log({ data });

  const requestDetailsData =
    selectedRequest &&
    mapToRequestDetailsData(selectedRequest)((req) => ({
      headers: {
        label: 'Headers',
        general: {
          label: 'General',
          data: {
            method: {
              label: 'Method',
              data: req.method,
            },
            status: {
              label: 'Code',
              data: req.status,
            },
            url: {
              label: 'Url',
              data: req.url,
            },
          },
        },
        requestHeaders: {
          data: req.requestHeaders,
          label: 'Request Headers',
        },
        responseHeaders: {
          data: req.responseHeaders,
          label: 'Response Headers',
        },
      },
      payload: {
        data: {
          requestPayload: { data: req.payload, label: 'Request Payload' },
        },
        label: 'Payload',
      },
      preview: {
        data: req.payload,
        label: 'Preview',
      },
      response: { data: req.response, label: 'Response' },
    }));

  const renderRequestDetailsChildren = (
    object: Record<string, RequestDetailsTypes.Child<string | number>>
  ) => {
    return Object.keys(object).map(
      (key, i) =>
        key !== 'label' && (
          <div
            className="text-gray-400 p-2 px-4 break-words"
            key={Math.random()}
          >
            <span className="font-semibold">{[object[key].label]}: </span>
            <span>{object[key].data}</span>
          </div>
        )
    );
  };

  console.log({ requestDetailsData });

  const closeRequestDetails = () => setSelectedRequest(undefined);
  return (
    <div className="h-full relative">
      <DeveloperToolsTable data={data} onSelected={openRequestDetails} />
      {requestDetailsData && (
        <>
          <div
            className="bg-black bg-opacity-50 absolute inset-0"
            onClick={() => closeRequestDetails()}
          ></div>
          <div className="bg-developerTools-tabs-headerBg shadow-lg inset-0 left-1/4 absolute  h-full font-sans font-light text-left overflow-y-auto">
            <Tabs
              renderHeader={(headerData) => (
                <DeveloperToolsTabsHeader data={headerData} />
              )}
              tabs={{
                headers: {
                  label: requestDetailsData.headers.label,
                  component: (
                    <div>
                      <RequestDetailsSection
                        label={requestDetailsData.headers.general.label}
                      >
                        {renderRequestDetailsChildren(
                          requestDetailsData.headers.general.data
                        )}
                      </RequestDetailsSection>
                      <RequestDetailsSection
                        label={requestDetailsData.headers.requestHeaders.label}
                      >
                        <div>
                          {requestDetailsData.headers.requestHeaders.data.map(
                            (header) => (
                              <div className="text-gray-400 p-2 px-4 ">
                                <span className="font-semibold">
                                  {header.name}:{' '}
                                </span>
                                <span className="break-words">
                                  {header.value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </RequestDetailsSection>
                      <RequestDetailsSection
                        label={requestDetailsData.headers.responseHeaders.label}
                      >
                        {requestDetailsData.headers.responseHeaders.data.map(
                          (header) => (
                            <div className="text-gray-400 p-2 px-4">
                              <span className="font-semibold">
                                {header.name}:{' '}
                              </span>
                              <span className="break-words">
                                {header.value}
                              </span>
                            </div>
                          )
                        )}
                      </RequestDetailsSection>
                    </div>
                  ),
                },
                payload: {
                  label: requestDetailsData.payload.label,
                  component: (
                    <div className="h-full">
                      <RequestDetailsSection
                        label={
                          requestDetailsData.payload.data.requestPayload.label
                        }
                      >
                        <RequestDetailsSectionBox>
                          <code>
                            {JSON.stringify(
                              requestDetailsData.payload.data.requestPayload
                                .data,
                              null,
                              4
                            )}
                          </code>
                        </RequestDetailsSectionBox>
                      </RequestDetailsSection>
                    </div>
                  ),
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

const RequestDetailsSection = (
  props: { label: string } & PropsWithChildren
) => {
  return (
    <section className=" pb-3">
      <article>
        <div className="p-4 py-2 ">
          <h1 className="text-md text-gray-300 font-semibold">{props.label}</h1>
        </div>
        <RequestDetailsSectionBox>{props.children}</RequestDetailsSectionBox>
      </article>
    </section>
  );
};

const RequestDetailsSectionBox = (
  props: PropsWithChildren & { onClick?: () => void }
) => {
  return (
    <div className="p-2">
      <div
        className="text-gray-400 text-xs p-2 bg-gray-900 rounded-md cursor-pointer hover:bg-gray-800"
        onClick={() => props.onClick?.()}
      >
        {props.children}
      </div>
    </div>
  );
};

const DeveloperToolsTabsHeader = <K,>({ data }: TabsTypes.HeaderProps<K>) => {
  return (
    <header className="bg-developerTools-table-headerBg">
      {data.map(({ isActive, key, label, onSelected }) => (
        <button
          key={key as string}
          onClick={() => onSelected(key)}
          className={twMerge(
            'p-3 text-sm',
            isActive
              ? 'bg-black text-white'
              : 'text-gray-400 hover:text-white hover:bg-developerTools-tabs-tabHoverBg'
          )}
        >
          {label}
        </button>
      ))}
    </header>
  );
};

namespace RequestDetailsTypes {
  export type Child<T> = {
    [k: string]: any;
    label: string;
    data: T;
  };

  export type RequestDetailsData = {
    headers: {
      label: string;
      general: {
        [k: string]: any;
        label: string;
        data: {
          url: Child<string>;
          method: Child<string>;
          status: Child<number>;
        };
      };
      responseHeaders: {
        label: string;
        data: DeveloperToolsTypes.TableData['responseHeaders'];
      };
      requestHeaders: {
        label: string;
        data: DeveloperToolsTypes.TableData['requestHeaders'];
      };
    };
    payload: {
      label: string;
      data: {
        requestPayload: Child<string>;
      };
    };
    preview: {
      label: string;
      data: any;
    };
    response: {
      label: string;
      data: any;
    };
  };
}

// const mapToRequestDetailsData = <T,>(
//   data: T,
//   cb: (data: T) => RequestDetailsData
// ) => cb(data);

const mapToRequestDetailsData = <T,>(data: T) => {
  const fn = (cb: (data: T) => RequestDetailsTypes.RequestDetailsData) =>
    cb(data);
  return fn;
};

export { DeveloperToolsTypes, DeveloperTools };
