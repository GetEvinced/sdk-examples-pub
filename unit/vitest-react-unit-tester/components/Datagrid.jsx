import React from "react";

const Datagrid = () => {
  return (
    <>
      <h4 id="grid1Label">Transactions January 1 through January 6</h4>
      <div className="table-wrap">
        <table
          id="ex1-grid"
          role="grid"
          aria-labelledby="grid1Label"
          className="data"
        >
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col">Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td tabIndex="-1">01-Jan-16</td>
              <td tabIndex="-1">Deposit</td>
              <td>
                <a tabIndex="-1" href="https://evinced.com">
                  Cash Deposit
                </a>
              </td>
              <td tabIndex="-1">$1,000,000.00</td>
              <td tabIndex="-1">$1,000,000.00</td>
            </tr>
            <tr>
              <td tabIndex="-1">02-Jan-16</td>
              <td tabIndex="-1">Debit</td>
              <td>
                <a tabIndex="-1" href="https://evinced.com">
                  Down Town Grocery
                </a>
              </td>
              <td tabIndex="-1">$250.00</td>
              <td tabIndex="-1">$999,750.00</td>
            </tr>
            <tr>
              <td tabIndex="-1">03-Jan-16</td>
              <td tabIndex="-1">Debit</td>
              <td>
                <a tabIndex="-1" href="https://evinced.com">
                  Hot Coffee
                </a>
              </td>
              <td tabIndex="-1">$9.00</td>
              <td tabIndex="-1">$999,741.00</td>
            </tr>
            <tr>
              <td tabIndex="-1">04-Jan-16</td>
              <td tabIndex="-1">Debit</td>
              <td>
                <a tabIndex="-1" href="https://evinced.com">
                  The Filling Station
                </a>
              </td>
              <td tabIndex="-1">$88.00</td>
              <td tabIndex="-1">$999,653.00</td>
            </tr>
            <tr>
              <td tabIndex="-1">05-Jan-16</td>
              <td tabIndex="-1">Debit</td>
              <td>
                <a tabIndex="-1" href="https://evinced.com">
                  Tinker's Hardware
                </a>
              </td>
              <td tabIndex="-1">$3,421.00</td>
              <td tabIndex="-1">$996,232.00</td>
            </tr>
            <tr>
              <td tabIndex="-1">06-Jan-16</td>
              <td tabIndex="-1">Debit</td>
              <td>
                <a tabIndex="-1" href="https://evinced.com">
                  Cutey's Salon
                </a>
              </td>
              <td tabIndex="-1">$700.00</td>
              <td tabIndex="-1">$995,532.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Datagrid;
