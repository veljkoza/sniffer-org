const data = [
    {
      id: '649119c8-3105-40',
      status: 200,
      type: 'xhr',
      initiator: 'requests...',
      size: '245 B',
      time: '143...',
    },
    {
      id: '649119c8-3105-40',
      status: 200,
      type: 'xhr',
      initiator: 'requests...',
      size: '245 B',
      time: '143...',
    },
    // ... Add other data rows as needed
  ];
  

export  const DeveloperToolsTable = () => {
    return (
      <div className="overflow-x-auto bg-developerTools-table-background h-full font-sans font-light text-left">
        <table className="min-w-full bg-white">
          <thead className="bg-developerTools-table-headerBg border-developerTools-table-border text-white text-sm">
            <tr>
              <th className="px-4 py-2 border border-developerTools-table-border font-light font-sans ">
                Name
              </th>
              <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
                Status
              </th>
              <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
                Type
              </th>
              <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
                Initiator
              </th>
              <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
                Size
              </th>
              <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="text-white text-xs">
            {data.map((row, index) => (
              <tr
                key={index}
                className={` ${
                  (index + 1) % 2 === 0
                    ? 'bg-developerTools-table-rowEvenBg'
                    : 'bg-developerTools-table-rowOddBg'
                }`}
              >
                <td className=" px-4 py-2 border-l border-developerTools-table-border border-r ">
                  {row.id}
                </td>
                <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                  {row.status}
                </td>
                <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                  {row.type}
                </td>
                <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                  {row.initiator}
                </td>
                <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                  {row.size}
                </td>
                <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                  {row.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  