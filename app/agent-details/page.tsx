import Image from 'next/image';
import AgentDetailsPage from '../components/dashboard/AgentDetailsPage';

interface Agent {
  agent_id: number;
  agent_name: string;
  total_calls: number;
  avg_agent_rating: number;
  avg_sentiment_rating: number;
  total_anomalies: number;
}

export const metadata = {
  title: 'Agent Statistics Dashboard',
  description: 'Agent statistics dashboard',
};

async function fetchAgentStatistics(): Promise<Agent[]> {
  try {
    const response = await fetch(
      'https://ai-call-summary-ap-batch-fjfxdsdhdkd5b7bt.centralus-01.azurewebsites.net/agent_statistics',
      {
        headers: { accept: 'application/json' },
        cache: 'no-store',
      }
    );
    if (!response.ok) {
      return [];
    }
    const data: Agent[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default async function AgentDetails() {
  const initialAgents = await fetchAgentStatistics();
  return (
    <div className="hidden-1 ot-dashbord-main-container mt-12">
      <div className="ot-min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-[40%_60%] gap-10 items-center">
          <div className="flex justify-center">
            <Image
              src="/dashboard-main1.svg"
              alt="I Call Summary Illustration"
              width={349}
              height={282}
              className="w-full max-w-md"
            />
          </div>
          <div className="space-y-6">
            <AgentDetailsPage initialAgents={initialAgents} />
          </div>
        </div>
      </div>
    </div>
  );
}


