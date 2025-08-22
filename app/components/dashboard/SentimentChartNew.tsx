

// import React from 'react';

// type SentimentItem = {
//   time_sec: number;
//   sentiment: "positive" | "neutral" | "negative";
//   text: string;
// };

// // Rule-based sentiment scoring function
// const getSentimentScore = (text: string): number => {
//   const lowerText = text.toLowerCase();
//   // Negative keywords
//   if (
//     lowerText.includes("frustrated") ||
//     lowerText.includes("annoying") ||
//     lowerText.includes("problem") ||
//     lowerText.includes("not resolved") ||
//     lowerText.includes("could not")
//   ) {
//     return -1; // Negative
//   }
//   // Positive keywords
//   if (
//     lowerText.includes("thank") ||
//     lowerText.includes("great") ||
//     lowerText.includes("happy") ||
//     lowerText.includes("thanks")
//   ) {
//     return 1; // Positive
//   }
//   // Default to neutral
//   return 0; // Neutral
// };

// // Get sentiment color based on score
// const getSentimentColor = (score: number): string => {
//   if (score > 0) return 'bg-blue-500';
//   if (score < 0) return 'bg-red-500';
//   return 'bg-purple-500';
// };

// // Get sentiment label
// const getSentimentLabel = (score: number): string => {
//   if (score > 0) return 'Positive';
//   if (score < 0) return 'Negative';
//   return 'Neutral';
// };

// // Format time in MM:SS format
// const formatTime = (seconds: number): string => {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// };

// export default function SentimentChartNew({ data }: { data?: SentimentItem[] }) {
//   if (!data || data.length === 0) {
//     return <p className="text-gray-500 text-sm">No sentiment data available</p>;
//   }

//   // Process data and group significant sentiment changes
//   const processedData = data.map((item) => ({
//     time: item.time_sec,
//     sentiment: getSentimentScore(item.text),
//     text: item.text,
//     originalSentiment: item.sentiment,
//   }));

//   // Filter for significant events (sentiment changes or notable keywords)
//   const significantEvents = processedData.filter((item, index) => {
//     if (index === 0) return true; // Always include first item
    
//     const prevSentiment = processedData[index - 1].sentiment;
//     const currentSentiment = item.sentiment;
    
//     // Include if sentiment changes or contains significant keywords
//     return (
//       prevSentiment !== currentSentiment ||
//       item.text.toLowerCase().includes('frustrated') ||
//       item.text.toLowerCase().includes('thank') ||
//       item.text.toLowerCase().includes('problem') ||
//       item.text.toLowerCase().includes('happy') ||
//       item.text.toLowerCase().includes('great')
//     );
//   });

//   // Create smooth curve path
//   const createCurvePath = () => {
//     if (significantEvents.length < 2) return '';
    
//     const height = 300;
    
//     const points = significantEvents.map((d, index) => ({
//       x: index * 120 + 60, // 80px width + 40px gap = 120px spacing, 60px offset for centering
//       y: height / 2 - (d.sentiment * (height / 4))
//     }));
    
//     let path = `M ${points[0].x} ${points[0].y}`;
    
//     for (let i = 1; i < points.length; i++) {
//       const prevPoint = points[i - 1];
//       const currentPoint = points[i];
      
//       // Create smooth curve using quadratic bezier
//       const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.5;
//       const controlY = prevPoint.y;
      
//       path += ` Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`;
//     }
    
//     return path;
//   };

//   const maxTime = Math.max(...significantEvents.map(d => d.time));
//   const minTime = Math.min(...significantEvents.map(d => d.time));
  
//   // Calculate total width based on 80px per time slot + 40px gap
//   const totalWidth = significantEvents.length * 120; // 80px width + 40px gap

//   return (
//     <div className="bg-gray-50 rounded-xl p-6 semantic-chart-new-wrapper">
//       <div className="relative semantic-chart-new">
//         {/* Y-axis labels */}
//         <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-600 font-medium z-10 sentimentChart-labels">
//           <div>Positive</div>
//           <div>Neutral</div>
//           <div>Negative</div>
//         </div>
        
//         {/* Scrollable container */}
//         <div className="ml-16 overflow-hidden overflow-x-auto overflow-custome-set">
//           <div className="relative" style={{ width: `${totalWidth}px`, minWidth: '100%' }}>
//             {/* SVG for curves */}
//             <svg width={totalWidth} height="300" className="overflow-visible">
//               {/* Background curve */}
//               <path
//                 d={createCurvePath()}
//                 fill="none"
//                 stroke="#e5e7eb"
//                 strokeWidth="80"
//                 className="opacity-50"
//               />
              
//               {/* Sentiment curve with gradient */}
//               <defs>
//                 <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                   <stop offset="0%" style={{ stopColor: '#8a5cf633', stopOpacity: 0.8 }} />
//                   <stop offset="50%" style={{ stopColor: '#3b83f62c', stopOpacity: 0.8 }} />
//                   <stop offset="100%" style={{ stopColor: '#06b5d42f', stopOpacity: 0.8 }} />
//                 </linearGradient>
//               </defs>
              
//               <path
//                 d={createCurvePath()}
//                 fill="none"
//                 stroke="url(#sentimentGradient)"
//                 strokeWidth="80"
//                 className="drop-shadow-sm"
//               />
//             </svg>
            
//             {/* Sentiment boxes */}
//             <div className="relative">
//               {significantEvents.map((event, index) => {
//                 const xPosition = index * 120 + 60; // 80px width + 40px gap = 120px spacing, 60px offset for centering
//                 const yPosition = event.sentiment === 1 ? 'positive-sentimaent-box' : 
//                                 event.sentiment === -1 ? 'negative-sentimaent-box ' : '-translate-y-1/2 Neutral-sentimaent-box';
                
//                 return (
//                   <div
//                     key={index}
//                     className={`absolute ${yPosition} transform -translate-x-1/2`}
//                     style={{ left: `${xPosition}px` }}
//                   >
//                     {/* Sentiment box */}
//                     <div className={`${getSentimentColor(event.sentiment)}  p-2 text-white text-sm font-medium shadow-lg text-left relative damy-box`}
//                          style={{ width: '80px' }}>
//                       {/* Checkmark icon */}
//                       <div className=" w-4 h-4 bg-white rounded-full flex items-left justify-left">
//                         <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                       </div>
                      
//                       <div className="mb-1 text-xs opacity-90">Sentiment</div>
//                       <div className="font-bold text-xs">{getSentimentLabel(event.sentiment)}</div>
                      
//                       {/* Original text with ellipsis inside the box */}
//                       <div className="text-xs opacity-80 mt-1 truncate" 
//                            style={{ fontSize: '10px' }}
//                            title={event.text}>
//                         {event.text}
//                       </div>
                      
//                       {/* Connector line
//                       <div className={`absolute w-0.5 h-8 bg-gray-300 left-1/2 transform -translate-x-1/2 ${
//                         event.sentiment === 1 ? 'top-full' : 
//                         event.sentiment === -1 ? 'bottom-full' : 'top-full'
//                       }`}></div> */}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {/* Timeline */}
//             <div className=" relative">
//               {/* Timeline line */}
//               {/* <div className="absolute top-1/2 left-0 h-0.5 bg-gray-300 transform -translate-y-1/2" style={{ width: `${totalWidth}px` }}></div> */}
              
//               {/* Time markers */}
//               {significantEvents.map((event, index) => {
//                 const xPosition = index * 120 + 60; // 80px width + 40px gap = 120px spacing, 60px offset for centering
                
//                 return (
//                   <div
//                     key={index}
//                     className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
//                     style={{ left: `${xPosition}px` }}
//                   >
//                     {/* <div className="w-2 h-2 bg-gray-400 rounded-full"></div> */}
//                     <div className="text-xs text-gray-600 mt-2 text-center font-medium" style={{ width: '80px' }}>
//                       {formatTime(event.time)}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';

type SentimentItem = {
  time_sec: number;
  sentiment: "positive" | "neutral" | "negative";
  text: string;
};

// Rule-based sentiment scoring function
const getSentimentScore = (text: string): number => {
  const lowerText = text.toLowerCase();
  // Negative keywords
  if (
    lowerText.includes("frustrated") ||
    lowerText.includes("annoying") ||
    lowerText.includes("problem") ||
    lowerText.includes("not resolved") ||
    lowerText.includes("could not")
  ) {
    return -1; // Negative
  }
  // Positive keywords
  if (
    lowerText.includes("thank") ||
    lowerText.includes("great") ||
    lowerText.includes("happy") ||
    lowerText.includes("thanks")
  ) {
    return 1; // Positive
  }
  // Default to neutral
  return 0; // Neutral
};

// Get sentiment color based on score
const getSentimentColor = (score: number): string => {
  if (score > 0) return 'bg-blue-500';
  if (score < 0) return 'bg-red-500';
  return 'bg-purple-500';
};

// Get sentiment label
const getSentimentLabel = (score: number): string => {
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
};

// Format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function SentimentChartNew({ data }: { data?: SentimentItem[] }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm">No sentiment data available</p>;
  }

  // Process data and group significant sentiment changes
  const processedData = data.map((item) => ({
    time: item.time_sec,
    sentiment: getSentimentScore(item.text),
    text: item.text,
    originalSentiment: item.sentiment,
  }));

  // Filter for significant events (sentiment changes or notable keywords)
  const significantEvents = processedData.filter((item, index) => {
    if (index === 0) return true; // Always include first item
    
    const prevSentiment = processedData[index - 1].sentiment;
    const currentSentiment = item.sentiment;
    
    // Include if sentiment changes or contains significant keywords
    return (
      prevSentiment !== currentSentiment ||
      item.text.toLowerCase().includes('frustrated') ||
      item.text.toLowerCase().includes('thank') ||
      item.text.toLowerCase().includes('problem') ||
      item.text.toLowerCase().includes('happy') ||
      item.text.toLowerCase().includes('great')
    );
  });

  // Create smooth curve path
  const createCurvePath = () => {
    if (significantEvents.length < 2) return '';
    
    const height = 300;
    
    const points = significantEvents.map((d, index) => ({
      x: index * 120 + 60, // 80px width + 40px gap = 120px spacing, 60px offset for centering
      y: height / 2 - (d.sentiment * (height / 4))
    }));
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Create smooth curve using quadratic bezier
      const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.5;
      const controlY = prevPoint.y;
      
      path += ` Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return path;
  };

  const maxTime = Math.max(...significantEvents.map(d => d.time));
  const minTime = Math.min(...significantEvents.map(d => d.time));
  
  // Calculate total width based on 80px per time slot + 40px gap
  const totalWidth = significantEvents.length * 120; // 80px width + 40px gap

  return (
    <div className="bg-gray-50 rounded-xl p-6 semantic-chart-new-wrapper">
      <div className="relative semantic-chart-new">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-600 font-medium z-10 sentimentChart-labels transition-all duration-300 backdrop-blur-xl supports-[backdrop-filter]:bg-white/0 semantic-chartp-n-n">
          <div>Positive</div>
          <div>Neutral</div>
          <div>Negative</div>
        </div>
        
        {/* Scrollable container */}
        <div className="ml-16 overflow-hidden overflow-x-auto overflow-custome-set">
          <div className="relative" style={{ width: `${totalWidth}px`, minWidth: '100%' }}>
            {/* SVG for curves */}
            <svg width={totalWidth} height="300" className="overflow-visible">
              {/* Background curve */}
              <path
                d={createCurvePath()}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                className="opacity-50"
              />
              
              {/* Sentiment curve with gradient */}
              <defs>
                <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#8a5cf605', stopOpacity: 0 }} />
                  <stop offset="50%" style={{ stopColor: '#3b83f60a', stopOpacity: 0 }} />
                  <stop offset="100%" style={{ stopColor: '#06b5d407', stopOpacity: 0}} />
                </linearGradient>
              </defs>
              
              <path
                d={createCurvePath()}
                fill="none"
                stroke="url(#sentimentGradient)"
                strokeWidth="1"
                className="drop-shadow-sm"
              />
            </svg>
            
            {/* Sentiment boxes */}
            <div className="relative">
              {significantEvents.map((event, index) => {
                const xPosition = index * 120 + 60; // 80px width + 40px gap = 120px spacing, 60px offset for centering
                const yPosition = event.sentiment === 1 ? 'positive-sentimaent-box' : 
                                event.sentiment === -1 ? 'negative-sentimaent-box' : '-translate-y-1/2 Neutral-sentimaent-box';
                // Add next sentiment class only if not the last item and next item has a sentiment
                const nextSentimentClass = index < significantEvents.length - 1 
                  ? `next-${getSentimentLabel(significantEvents[index + 1].sentiment)}`
                  : '';
                
                return (
                  <div
                    key={index}
                    className={`absolute ${yPosition} transform -translate-x-1/2 ${nextSentimentClass}`}
                    style={{ left: `${xPosition}px` }}
                  >
                    {/* Sentiment box */}
                    <div className={`${getSentimentColor(event.sentiment)}  p-2 text-white text-sm font-medium shadow-lg text-left relative damy-box`}
                         style={{ width: '80px' }}>
                      {/* Checkmark icon */}
                      <div className=" w-4 h-4 flex items-left justify-left">
                       <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7.36914" cy="7.47266" r="7" fill="white"/>
                        <path d="M11.2764 4.58351C11.4054 4.72534 11.399 4.94868 11.2622 5.08236L5.86316 10.3574C5.70155 10.5153 5.44785 10.5104 5.29198 10.3464L3.46707 8.42642C3.33512 8.28759 3.33671 8.06415 3.47064 7.92736C3.60456 7.79057 3.8201 7.79223 3.95206 7.93106L5.59002 9.65435L10.7952 4.56874C10.932 4.43507 11.1475 4.44168 11.2764 4.58351Z" fill="#2E90FA"/>
                       </svg>

                      </div>
                      
                      {/* <div className="text-xs  font-normal mt-1">Sentiment</div> */}
                      <div className="font-bold text-md mt-1">{getSentimentLabel(event.sentiment)}</div>
                      
                      {/* Original text with ellipsis inside the box */}
                      <div className="text-xs opacity-80 mt-1 two-line-ellipsis" 
                           style={{ fontSize: '10px' }}
                           title={event.text}>
                        {event.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Timeline */}
            <div className="relative timelint-section">
              {significantEvents.map((event, index) => {
                const xPosition = index * 120 + 60; // 80px width + 40px gap = 120px spacing, 60px offset for centering
                
                return (
                  <div
                    key={index}
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${xPosition}px` }}
                  >
                    <div className="text-xs text-gray-600 mt-2 text-center font-medium overflow-hidden" style={{ width: '80px' }}>
                      {formatTime(event.time)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}