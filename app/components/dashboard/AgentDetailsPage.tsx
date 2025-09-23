'use client'

import { useMemo, useState } from 'react';
import Head from 'next/head';
import CallProcessor from './processCalls';

interface Agent {
  agent_id: number;
  agent_name: string;
  total_calls: number;
  avg_agent_rating: number;
  avg_sentiment_rating: number;
  total_anomalies: number;
}

interface AgentDetailsPageProps {
  initialAgents?: Agent[];
}

const AgentDetailsPage: React.FC<AgentDetailsPageProps> = ({ initialAgents = [] }) => {
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    () => initialAgents.map((a) => a.agent_id.toString())
  );

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => {
      const isSelected = prev.includes(agentId);
      const next = isSelected ? prev.filter((id) => id !== agentId) : [...prev, agentId];
      setSelectAll(next.length === initialAgents.length);
      return next;
    });
    setIsDropdownOpen(false);
  };

  const clearAll = () => {
    setSelectedAgents([]);
    setSelectAll(false);
    setIsDropdownOpen(false);
  };

  const selectAllAgents = () => {
    setSelectedAgents(initialAgents.map((a) => a.agent_id.toString()));
    setSelectAll(true);
    setIsDropdownOpen(false);
  };

  const selectedAgentsData = useMemo(
    () => {
      const ids = new Set(selectedAgents);
      return initialAgents.filter((agent) => ids.has(agent.agent_id.toString()));
    },
    [initialAgents, selectedAgents]
  );

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Agent Statistics Dashboard</title>
        <meta name="description" content="Agent statistics dashboard" />
      </Head>

      <h1 className="text-2xl font-bold mb-4">Agent Statistics Dashboard</h1>

      {initialAgents.length === 0 ? (
        <div className="text-gray-500 text-center">
          <p>No agents found. Would you like to refresh the data?</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 space-y-2">
            {selectedAgents.length > 0 && (
              <div className="mb-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Selected Agents ({selectedAgents.length})
                  </span>
                  <button onClick={clearAll} className="text-xs text-red-600 hover:text-red-800">
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedAgents.map((id) => {
                    const agent = initialAgents.find((a) => a.agent_id.toString() === id);
                    if (!agent) return null;
                    return (
                      <div key={id} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        <span className="truncate max-w-[150px]">{agent.agent_name}</span>
                        <button onClick={() => toggleAgent(id)} className="ml-2 hover:text-blue-900">
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative agent-selector-dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-[45px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white hover:border-gray-400 transition-colors"
              >
                <span className={selectedAgents.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                  {selectedAgents.length === 0
                    ? 'Select Agents...'
                    : `${selectedAgents.length} agent${selectedAgents.length > 1 ? 's' : ''} selected`}
                </span>
              </button>

              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M1.10378 1.09419L5.82044 6.00739L10.5371 1.09419"
                    stroke="#34334B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200 flex items-center gap-3">
                    <button
                      onClick={() => (selectAll ? clearAll() : selectAllAgents())}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectAll ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  {initialAgents.map((agent) => {
                    const id = agent.agent_id.toString();
                    const isSelected = selectedAgents.includes(id);
                    return (
                      <div
                        key={id}
                        onClick={() => toggleAgent(id)}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className={`truncate text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-900'}`}>
                          {agent.agent_name} (ID: {agent.agent_id})
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0 ml-2">
                            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                              <path d="M1 4.5L4 7.5L11 0.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {selectedAgentsData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Agent Name</th>
                    <th className="py-2 px-4 border-b text-left">Agent ID</th>
                    <th className="py-2 px-4 border-b text-left">Total Calls</th>
                    <th className="py-2 px-4 border-b text-left">Average Agent Rating</th>
                    <th className="py-2 px-4 border-b text-left">Average Sentiment Rating</th>
                    <th className="py-2 px-4 border-b text-left">Total Anomalies</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAgentsData.map((agent) => (
                    <tr key={agent.agent_id}>
                      <td className="py-2 px-4 border-b">{agent.agent_name}</td>
                      <td className="py-2 px-4 border-b">{agent.agent_id}</td>
                      <td className="py-2 px-4 border-b">{agent.total_calls}</td>
                      <td className="py-2 px-4 border-b">{agent.avg_agent_rating}</td>
                      <td className="py-2 px-4 border-b">{agent.avg_sentiment_rating}</td>
                      <td className="py-2 px-4 border-b">{agent.total_anomalies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <CallProcessor />
    </div>
  );
};

export default AgentDetailsPage;