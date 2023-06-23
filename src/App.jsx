import "./App.css";
import * as React from "react";
import { useState } from "react";
import { useTable } from "react-table";
import axios from "axios";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";

function App() {
  // State variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  // Fetching data from the specified URL
  React.useEffect(() => {
    axios
      .get("https://uacdn.sgp1.digitaloceanspaces.com/json/data.json")
      .then((response) => {
        console.log(response);
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // // Toggle function to expand or collapse rows
  // const toggleRow = (index) => {
  //   const newData = [...data];
  //   newData[index].isExpanded = !newData[index].isExpanded;
  //   setData(newData);
  // };
  const toggleRow = (index) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [index]: !prevExpandedRows[index],
    }));
  };

  // Table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "OrderID",
        accessor: "orders[0].orderId", // Access the first order's orderId
      },
      {
        Header: "Product",
        accessor: "orders[0].product", // Access the first order's product
      },
      {
        Header: "Quantity",
        accessor: "orders[0].quantity", // Access the first order's quantity
      },
    ],
    []
  );

  // Table instance using React Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // Rendering the table
  // Rendering the table
  // Rendering the table
  return (
    <div className="App">
      <div className="container">
        <table {...getTableProps()}>
          <thead>
            <tr>
              <th colSpan={columns.length / 1}></th>
              <th colSpan={1} className="left-aligned">
                Orders
              </th>
            </tr>
            <tr>
              <th></th> {/* Empty column for the button */}
              {headerGroups.map((headerGroup) =>
                headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              const isExpanded = expandedRows[index];
              return (
                <>
                  <tr {...row.getRowProps()}>
                    <td>
                      <button onClick={() => toggleRow(index)}>
                        {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                      </button>
                    </td>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                  {isExpanded && (
  <tr>
    <td colSpan={columns.length + 1}>
      <div>
        <p>Order Information:</p>
        {row.original.orders.map((order) => (
          <div key={order.orderId}>
            <p>Order ID: {order.orderId}</p>
            <p>Product: {order.product}</p>
            <p>Quantity: {order.quantity}</p>
          </div>
        ))}
      </div>
    </td>
  </tr>
)}

                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
