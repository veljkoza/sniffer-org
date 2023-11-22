import { PropsWithChildren, useState } from 'react';
import { DeveloperToolsTable } from './table';
import { Tabs, TabsTypes } from '../../../../shared/components/tabs/Tabs';
import { twMerge } from 'tailwind-merge';
import { CopyToClipboardPopover, useClipboard } from '@sniffer/ui';

const downloadObjectAsJson = (exportObj: any, exportName = 'requests') => {
  console.log('tyest', { exportObj });
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj, null, 4));

  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

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

  const { copyContent } = useClipboard();

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
      response: {
        data: {
          responsePayload: { data: req.response, label: 'Response Payload' },
        },
        label: 'Response',
      },
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

  const stringifyFormattedJson = (json: { [k: string]: any }) =>
    JSON.stringify(json, null, 4);

  const closeRequestDetails = () => setSelectedRequest(undefined);
  const payloadJSON = requestDetailsData
    ? stringifyFormattedJson(
        requestDetailsData.payload.data.requestPayload.data
      )
    : '';
  const responseJSON = requestDetailsData
    ? stringifyFormattedJson(
        requestDetailsData.response.data.responsePayload.data
      )
    : '';

  const summary = {
    url: requestDetailsData?.headers.general.data.url.data,
    method: requestDetailsData?.headers.general.data.method.data,
    status: requestDetailsData?.headers.general.data.status.data,
    payload: requestDetailsData?.payload.data.requestPayload.data,
    response: requestDetailsData?.response.data.responsePayload.data,
    responseHeaders: requestDetailsData?.headers.responseHeaders.data,
    requestHeaders: requestDetailsData?.headers.requestHeaders.data,
  };

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
                <div className="flex justify-between">
                  <DeveloperToolsTabsHeader data={headerData} />
                  <button
                    className="bg-orange-500 text-white p-2 text-xs font-bold"
                    onClick={() => downloadObjectAsJson(summary)}
                  >
                    Generate Summary
                  </button>
                </div>
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
                        onClick={() =>
                          copyContent(
                            stringifyFormattedJson(
                              requestDetailsData.headers.requestHeaders.data
                            )
                          )
                        }
                      >
                        <div>
                          {requestDetailsData.headers.requestHeaders.data?.map(
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
                        onClick={() => {
                          copyContent(
                            stringifyFormattedJson(
                              requestDetailsData.headers.responseHeaders.data
                            )
                          );
                        }}
                        label={requestDetailsData.headers.responseHeaders.label}
                      >
                        {requestDetailsData.headers.responseHeaders.data?.map(
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
                        onClick={() => copyContent(payloadJSON)}
                        label={
                          requestDetailsData.payload.data.requestPayload.label
                        }
                      >
                        <code>{payloadJSON}</code>
                      </RequestDetailsSection>
                    </div>
                  ),
                },
                response: {
                  label: requestDetailsData.response.label,
                  component: (
                    <div className="h-full">
                      <RequestDetailsSection
                        onClick={() => copyContent(responseJSON)}
                        label={
                          requestDetailsData.response.data.responsePayload.label
                        }
                      >
                        <code>{responseJSON}</code>
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
  props: { label: string; onClick?: () => void } & PropsWithChildren
) => {
  return (
    <section className=" pb-3">
      <article>
        <div className="p-4 py-2 ">
          <h1 className="text-md text-gray-300 font-semibold">{props.label}</h1>
        </div>
        <RequestDetailsSectionBox onClick={props.onClick}>
          {props.children}
        </RequestDetailsSectionBox>
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
        requestPayload: Child<any>;
      };
    };
    preview: {
      label: string;
      data: any;
    };
    response: {
      label: string;
      data: {
        responsePayload: Child<any>;
      };
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
