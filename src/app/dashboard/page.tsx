'use client';

import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  ChartBarIcon,
  ArrowUpIcon, 
  ArrowDownIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  // Mock data - this will be replaced with real data from APIs later
  const portfolioData = {
    totalValue: 28500.00,
    totalInvested: 25000.00,
    gainLoss: 3500.00,
    gainLossPercentage: 14.0,
    todayChange: 250.00,
    todayChangePercentage: 0.88
  };

  const recentTransactions = [
    { id: 1, type: 'buy', investment: 'Bitcoin', amount: 1000, date: '2025-07-20' },
    { id: 2, type: 'sell', investment: 'NVIDIA', amount: 500, date: '2025-07-18' },
    { id: 3, type: 'buy', investment: 'Tesla', amount: 750, date: '2025-07-15' },
  ];

  const topPerformers = [
    { name: 'Bitcoin', change: 15.2, value: 8500 },
    { name: 'NVIDIA', change: 12.8, value: 6200 },
    { name: 'Tesla', change: -3.4, value: 4800 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your portfolio overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${portfolioData.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Invested */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${portfolioData.totalInvested.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Gain/Loss */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  portfolioData.gainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <ArrowTrendingUpIcon className={`h-6 w-6 ${
                    portfolioData.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
                <div className="flex items-center">
                  <p className={`text-2xl font-bold ${
                    portfolioData.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(portfolioData.gainLoss).toLocaleString()}
                  </p>
                  <span className={`ml-2 text-sm font-medium ${
                    portfolioData.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({portfolioData.gainLossPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Change */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  portfolioData.todayChange >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {portfolioData.todayChange >= 0 ? (
                    <ArrowUpIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <ArrowDownIcon className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Today's Change</p>
                <div className="flex items-center">
                  <p className={`text-2xl font-bold ${
                    portfolioData.todayChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(portfolioData.todayChange).toLocaleString()}
                  </p>
                  <span className={`ml-2 text-sm font-medium ${
                    portfolioData.todayChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({portfolioData.todayChangePercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <a href="/transactions" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      transaction.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.type === 'buy' ? 'B' : 'S'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{transaction.investment}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${
                    transaction.type === 'buy' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'buy' ? '-' : '+'}${transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
              <a href="/performance" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-700">
                        {performer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">${performer.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {performer.change >= 0 ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      performer.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(performer.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Ready to add a new transaction?</h3>
              <p className="text-indigo-100">Keep your portfolio up to date with your latest investments.</p>
            </div>
            <a
              href="/add-transaction"
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Add Transaction
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
