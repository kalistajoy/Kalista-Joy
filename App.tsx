import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Workflow, 
  ChevronDown, 
  MoreHorizontal, 
  Mail, 
  Play, 
  Check 
} from 'lucide-react';
import { User } from './types';
import { USERS } from './constants';

const Badge = ({ color, children }: { color: 'green' | 'yellow' | 'blue' | 'gray', children: React.ReactNode }) => {
    const colors = {
        green: 'bg-green-100 text-green-800 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${colors[color] || colors.gray}`}>
            {children}
        </span>
    );
};

const Avatar = ({ src, alt }: { src: string, alt: string }) => (
    <img src={src} alt={alt} className="w-5 h-5 rounded-full object-cover" />
);

const WorkflowPanel = ({ 
    isOpen, 
    onClose, 
    viewState, 
    onRequestReview,
    currentUser,
    onApprove,
    status = 'running'
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    viewState: 'input' | 'overview' | 'review', 
    onRequestReview: () => void,
    currentUser: User,
    onApprove: () => void,
    status?: 'running' | 'completed'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Pre-filled values for review mode
  const isReview = viewState === 'review';
  const rateValue = isReview ? '$125,000' : '';
  const discountValue = isReview ? '15' : '';
  const termValue = isReview ? '2 Years' : '1 Year';
  const notesValue = isReview ? 'This pricing reflects our standard enterprise terms and is valid through the end of Q1.' : '';

  const isCompleted = status === 'completed';

  return (
    <div 
      className={`
        h-full bg-white border-l border-gray-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col z-30 flex-shrink-0
        ${isOpen ? 'w-[400px] opacity-100' : 'w-0 opacity-0'}
      `}
    >
        <div className="w-[400px] flex flex-col h-full relative">
            {/* Header */}
            <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors flex-shrink-0">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 bg-orange-50 rounded flex items-center justify-center text-orange-600 flex-shrink-0 border border-orange-100">
                            <Workflow size={12} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 truncate" title="Respond to Pricing Inquiry (Q1 Renewal)">
                           Respond to Pricing Inquiry...
                        </span>
                    </div>
                </div>
                {viewState === 'input' || viewState === 'review' ? (
                     <div className="text-xs font-medium text-gray-400 flex-shrink-0">Action</div>
                ) : (
                     <div className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer">
                         <MoreHorizontal size={16} />
                     </div>
                )}
            </div>

            {viewState === 'input' || viewState === 'review' ? (
                <>
                {/* Input Content */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1 pb-20">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Annual Rate</label>
                        <input defaultValue={rateValue} type="text" className="w-full text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 px-3 py-2 outline-none transition-all" placeholder="$" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Multi-Year Discount (%)</label>
                        <input defaultValue={discountValue} type="text" className="w-full text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 px-3 py-2 outline-none transition-all" placeholder="%" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Contract Term</label>
                        <div className="relative">
                            <select defaultValue={termValue} className="w-full text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 border px-3 py-2 appearance-none outline-none transition-all">
                                <option>1 Year</option>
                                <option>2 Years</option>
                                <option>3 Years</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Additional Notes</label>
                        <textarea defaultValue={notesValue} className="w-full text-sm border border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 px-3 py-2 h-32 resize-none outline-none transition-all" />
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white flex flex-col items-end gap-3">
                    {/* Primary Action - Always 'Submit' or 'Approve' */}
                    <button 
                        onClick={viewState === 'review' ? onApprove : undefined}
                        className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-0 py-0 rounded-md shadow-sm flex items-center justify-between overflow-hidden transition-colors group"
                    >
                        <span className="px-4 py-2.5">{viewState === 'review' ? 'Approve and Submit' : 'Submit'}</span> 
                        <span className="border-l border-blue-500 px-3 py-2.5 bg-blue-700/30 text-blue-100 flex items-center text-[10px] gap-1 group-hover:bg-blue-700/50 h-full">
                            Ctrl ↵
                        </span>
                    </button>

                    {/* Secondary Action */}
                    {viewState === 'input' ? (
                        <div className="relative">
                            {showTooltip && (
                                <div className="absolute bottom-full right-0 mb-2 w-max max-w-[280px] bg-gray-800 text-white text-[11px] rounded px-2.5 py-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200 whitespace-nowrap">
                                    Email will not be sent until approved by Alex
                                    <div className="absolute top-full right-8 -ml-1 border-4 border-transparent border-t-gray-800"></div>
                                </div>
                            )}
                            <button 
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                onClick={onRequestReview}
                                className="text-xs font-medium text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-md px-4 py-2.5 transition-colors shadow-sm"
                            >
                                Request Review
                            </button>
                        </div>
                    ) : (
                         <button 
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-md px-4 py-2.5 transition-colors shadow-sm"
                        >
                            Decline
                        </button>
                    )}
                </div>
                </>
            ) : (
                <>
                {/* Overview Content (Read Only) */}
                <div className="p-6 space-y-8 overflow-y-auto flex-1 pb-20">
                    {/* Context Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                            <Workflow size={12} /> Context
                        </h3>
                        
                        <div className="grid grid-cols-[110px_1fr] gap-y-4 text-sm">
                            <div className="text-gray-400 flex items-center gap-2 text-xs">Executed by</div>
                            <div className="flex items-center gap-2">
                                <Avatar src={USERS.kalista.avatar} alt="Kalista" />
                                <span className="text-gray-900 font-medium text-sm">Kalista Joy</span>
                            </div>

                            <div className="text-gray-400 flex items-center gap-2 text-xs">Workflow run start...</div>
                            <div className="text-gray-900 text-sm">Jan 23, 2026 9:02 PM</div>
                            
                            <div className="text-gray-400 flex items-center gap-2 text-xs">Output</div>
                            <div className="text-gray-900 text-sm">Output</div>

                            <div className="text-gray-400 flex items-center gap-2 text-xs">State</div>
                            <div>
                                <span className="text-xs font-mono text-gray-500">{`{"stepInfos":{"trigger":...`}</span>
                            </div>

                            <div className="text-gray-400 flex items-center gap-2 text-xs">Workflow run status</div>
                            <div>
                                <Badge color={isCompleted ? 'green' : 'yellow'}>
                                    {isCompleted ? 'Completed' : 'Running'}
                                </Badge>
                            </div>

                            <div className="text-gray-400 flex items-center gap-2 text-xs">Last update</div>
                            <div className="text-gray-900 text-sm">{isCompleted ? '3 minutes ago' : 'less than a minute ago'}</div>

                            <div className="text-gray-400 flex items-center gap-2 text-xs">Updated by</div>
                            <div className="flex items-center gap-2">
                                <Avatar src={USERS.system.avatar} alt="System" />
                                <span className="text-gray-900 font-medium text-sm">System</span>
                            </div>
                        </div>
                    </div>

                    {/* Workflow Steps Visualizer */}
                    <div className="space-y-4">
                         <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                            Workflow
                        </h3>
                        
                        <div className="relative pl-2 space-y-6">
                            {/* Vertical connecting line */}
                            <div className="absolute left-[19px] top-4 bottom-8 w-[2px] bg-gray-100"></div>
                            
                            {/* Email Step (Action) */}
                            <div className="relative flex items-start gap-4">
                                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center z-10 flex-shrink-0">
                                    <Mail size={16} className="text-orange-500" />
                                </div>
                                <div className={`flex-1 ${isCompleted ? 'bg-white' : 'bg-orange-50'} border ${isCompleted ? 'border-gray-200' : 'border-orange-100'} rounded-lg p-3 shadow-sm flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-orange-200">Email</div>
                                        <div className="text-sm font-medium text-gray-900">Approval Request</div>
                                    </div>
                                    {isCompleted ? <Badge color="green">Completed</Badge> : <Badge color="yellow">Running</Badge>}
                                </div>
                            </div>

                             {/* Trigger Step */}
                             <div className="relative flex items-start gap-4">
                                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center z-10 flex-shrink-0">
                                    <Play size={14} className="text-gray-400 ml-0.5" fill="currentColor" />
                                </div>
                                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-0.5">TRIGGER</div>
                                        <div className="text-sm font-medium text-gray-900">Launch manually</div>
                                    </div>
                                    <Check size={16} className="text-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Read-Only Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white flex items-center justify-end gap-2">
                    <button className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors flex items-center gap-1">
                        Options <span className="text-gray-400">| Ctrl O</span>
                    </button>
                    <button 
                        onClick={() => window.open('https://twenty.com', '_blank')}
                        className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded shadow-sm flex items-center gap-1 transition-colors"
                    >
                        Open <span className="text-blue-200">| Ctrl ↵</span>
                    </button>
                </div>
                </>
            )}
        </div>
    </div>
  )
}

export default WorkflowPanel;