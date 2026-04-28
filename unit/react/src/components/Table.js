import React from "react";

const Table = ({ data }) => {
  return (
    <div>
      <table data-testid="table-component">
        <caption>Employee Information</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col">Department</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.position}</td>
              <td>{row.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
