import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';

export const WalletTransactions = ({ match }: { match: any }) => {
  // const { path } = match;
  // const { id } = match.params;

  return (
    <div className="card bg-light px-md-4 pb-md-2 p-2">
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-lg-flex align-items-lg-start">
        <a className="navbar-brand" href="#">
          Transactions <h5 className="text-muted pl-1">Welcome to your transactions</h5>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTransactions"
          aria-controls="navbarTransactions"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTransactions">
          <ul className="navbar-nav ml-lg-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="far fa-bell fa-2x"></i>
                <div className="badge badge-pill badge-primary align-top">1</div>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fa fa-search mr-1"></i>
                <input type="search" className="bg-light text-muted border-0 p-2" placeholder="Search" />
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="row mt-2 pt-2">
        <div className="col-md-6">
          <div className="d-flex justify-content-start align-items-center m-1">
            <i className="fas fa-long-arrow-alt-down"></i>
            <div className="text text-muted mx-3">Income</div>
            <div className="text-dark ml-4">$9,758.23</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-md-end align-items-center m-1">
            <i className="fas fa-long-arrow-alt-up"></i>
            <div className="text text-muted mx-3">Expense</div>
            <div className="text-dark ml-4">$961.23</div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <ul className="nav nav-tabs w-75">
          <li className="nav-item">
            <a className="nav-link active" href="#history">
              History
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Reports
            </a>
          </li>
        </ul>
        <button className="btn btn-primary">New Transaction</button>
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-light table-borderless">
          <thead>
            <tr>
              <th scope="col">Activity</th>
              <th scope="col">Mode</th>
              <th scope="col">Date</th>
              <th scope="col" className="text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="fa fa-briefcase mr-1"></span> Coorg Trip
              </td>
              <td>
                <span className="fab fa-cc-mastercard"></span>
              </td>
              <td className="text-muted">12 Jul 2020, 12:30 PM</td>
              <td className="d-flex justify-content-end align-items-center">
                <span className="fas fa-long-arrow-alt-up mr-1"></span> $52.9
              </td>
            </tr>
            <tr>
              <td>
                <span className="fa fa-bed mr-1"></span> Hotel Leela Palace
              </td>
              <td>
                <span className="fab fa-cc-mastercard"></span>
              </td>
              <td className="text-muted">11 Jul 2020, 2:00 PM</td>
              <td className="d-flex justify-content-end align-items-center">
                <span className="fas fa-long-arrow-alt-up mr-1"></span> $18.9
              </td>
            </tr>
            <tr>
              <td>
                <span className="fas fa-exchange-alt mr-1"></span> Monthly Salary
              </td>
              <td>
                <span className="fab fa-cc-visa"></span>
              </td>
              <td className="text-muted">10 Jul 2020, 8:30 PM</td>
              <td className="d-flex justify-content-end align-items-center">
                <span className="fas fa-long-arrow-alt-down mr-1"></span> $9,765.00
              </td>
            </tr>
            <tr>
              <td>
                <span className="fas fa-exchange-alt mr-1"></span> Xbox Purchase
              </td>
              <td>
                <span className="fab fa-cc-mastercard"></span>
              </td>
              <td className="text-muted">12 May 2020, 4:30 PM</td>
              <td className="d-flex justify-content-end align-items-center">
                <span className="fas fa-long-arrow-alt-up mr-1"></span> $198.90
              </td>
            </tr>
            <tr>
              <td>
                <span className="fa fa-briefcase mr-1"></span> Nandini Hills Ride
              </td>
              <td>
                <span className="fab fa-cc-mastercard"></span>
              </td>
              <td className="text-muted">10 May 2020, 01:30 PM</td>
              <td className="d-flex justify-content-end align-items-center">
                <span className="fas fa-long-arrow-alt-up mr-1"></span> $97.9
              </td>
            </tr>
            <tr>
              <td>
                <span className="fa fa-briefcase mr-1"></span> Goa Beach Party
              </td>
              <td>
                <span className="fab fa-cc-visa"></span>
              </td>
              <td className="text-muted">09 May 2020, 01:30 PM</td>
              <td className="d-flex justify-content-end align-items-center">
                <span className="fas fa-long-arrow-alt-up mr-1"></span> $97.9
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center results">
        <span className="pl-md-3 pl-2 text-muted">
          Showing<b className="text-muted"> 1-7 of 200 </b> transactions
        </span>
        <div className="pt-3 pr-2">
          <nav aria-label="transaction navigation">
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&lt;</span>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&gt;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
