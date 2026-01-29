import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Settings, Inbox, Building2, Users, Briefcase, CheckSquare, 
  FileText, Workflow, HelpCircle, ChevronDown, MoreHorizontal, Plus, 
  ArrowUp, X, User as UserIcon, Calendar, CornerUpRight, CheckCircle2, 
  Loader2, Home, Paperclip, Mail, Sparkles, Reply, ArrowDownUp, Ban, Check, 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, LogOut,
  Clock, Activity, Filter, Play, Bell, Heart, Trash2, ChevronUp, Command,
  ArrowUpRight
} from 'lucide-react';
import { COMPANIES, INBOX_TASK, USERS } from './constants';
import { Company, Task, ViewState, User } from './types';

// --- Shared Components ---

const Avatar = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-5 h-5 rounded-full border border-gray-200 object-cover" />
);

type BadgeColor = 'gray' | 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'orange' | 'cyan' | 'pink';

const Badge = ({ children, color = 'gray' }: { children?: React.ReactNode; color?: BadgeColor }) => {
  const colors: Record<BadgeColor, string> = {
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${colors[color]} flex items-center gap-1 whitespace-nowrap`}>
      {children}
    </span>
  );
};

const CompanyLogo = ({ name, url }: { name: string, url?: string }) => {
    const [imgError, setImgError] = useState(false);
    
    if (url && !imgError) {
        return (
            <img 
                src={url} 
                className="w-3 h-3 object-contain rounded-sm" 
                alt="" 
                onError={() => setImgError(true)} 
            />
        );
    }

    return (
        <div className="w-3 h-3 rounded-sm bg-gray-200 flex items-center justify-center text-gray-500">
            <Building2 size={8} />
        </div>
    );
};

// --- Custom Pickers ---

const AssigneePicker = ({ 
    value, 
    onChange, 
    onClose,
    currentUser
}: { 
    value: User | null, 
    onChange: (u: User | null) => void, 
    onClose: () => void,
    currentUser: User
}) => {
    const [search, setSearch] = useState('');
    
    const filteredUsers = [USERS.sofia, USERS.alex].filter(u => {
        const term = search.toLowerCase();
        return u.name.toLowerCase().includes(term);
    });

    return (
        <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-2 border-b border-gray-100">
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full text-xs px-2 py-1.5 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded outline-none transition-all"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
                <button 
                    onClick={() => { onChange(null); onClose(); }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                    <Ban size={14} className="text-gray-400" />
                    No Assignee
                    {!value && <Check size={14} className="ml-auto text-blue-600" />}
                </button>
                {filteredUsers.map(user => (
                    <button 
                        key={user.name}
                        onClick={() => { onChange(user); onClose(); }}
                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Avatar src={user.avatar} alt={user.name} />
                        {user.name}
                        {value?.name === user.name && <Check size={14} className="ml-auto text-blue-600" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

const StatusPicker = ({ 
    value, 
    onChange, 
    onClose 
}: { 
    value: string | null, 
    onChange: (s: string | null) => void, 
    onClose: () => void 
}) => {
    const statuses: { label: string, color: BadgeColor }[] = [
        { label: 'To Do', color: 'blue' },
        { label: 'In Review', color: 'yellow' },
        { label: 'In Progress', color: 'purple' },
        { label: 'Done', color: 'green' }
    ];

    return (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
             <div className="p-2 border-b border-gray-100">
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full text-xs px-2 py-1.5 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded outline-none transition-all"
                />
            </div>
            <div className="py-1">
                <button 
                    onClick={() => { onChange(null); onClose(); }}
                    className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2 border-b border-dashed border-gray-100 mb-1"
                >
                    <span className="px-1.5 py-0.5 border border-gray-200 rounded bg-gray-50 text-gray-500">No Status</span>
                    {!value && <Check size={14} className="ml-auto text-blue-600" />}
                </button>
                {statuses.map(status => (
                    <button 
                        key={status.label}
                        onClick={() => { onChange(status.label); onClose(); }}
                        className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Badge color={status.color}>{status.label}</Badge>
                        {value === status.label && <Check size={14} className="ml-auto text-blue-600" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CalendarPicker = ({ 
    value, 
    onChange, 
    onClose 
}: { 
    value: string, 
    onChange: (d: string) => void, 
    onClose: () => void 
}) => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const startOffset = 4;

    return (
         <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-3">
             <div className="text-xs text-gray-500 mb-3 border-b border-gray-100 pb-2">01/24/2026 19:55</div>
             <div className="flex items-center justify-between mb-3">
                 <div className="flex gap-2">
                     <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1">January <ChevronDown size={10}/></button>
                     <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1">2026 <ChevronDown size={10}/></button>
                 </div>
                 <div className="flex gap-1">
                     <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronLeft size={12}/></button>
                     <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronRight size={12}/></button>
                 </div>
             </div>
             
             <div className="grid grid-cols-7 gap-1 mb-2">
                 {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                     <div key={d} className="text-center text-[10px] text-gray-400 font-medium">{d}</div>
                 ))}
             </div>
             
             <div className="grid grid-cols-7 gap-1">
                 {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                 {days.map(d => (
                     <button 
                        key={d}
                        onClick={() => { onChange(`01/${d}/2026 19:55`); onClose(); }}
                        className={`
                            h-7 w-7 rounded-md text-xs flex items-center justify-center transition-colors
                            ${d === 24 ? 'bg-blue-600 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}
                        `}
                     >
                         {d}
                     </button>
                 ))}
             </div>

             <div className="mt-3 pt-2 border-t border-gray-100">
                 <button onClick={() => { onChange(''); onClose(); }} className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
                     <CalendarIcon size={12} /> Clear
                 </button>
             </div>
         </div>
    );
};

// --- Left Sidebar ---

const SidebarItem = ({ icon: Icon, label, active, badge, onClick }: { icon: any, label: string, active?: boolean, badge?: number, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center justify-between px-3 py-1.5 mb-0.5 rounded-md cursor-pointer text-sm font-medium transition-colors select-none
      ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
    `}
  >
    <div className="flex items-center gap-2.5">
      <Icon size={16} strokeWidth={2} />
      <span>{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
        {badge}
      </span>
    )}
  </div>
);

const Sidebar = ({ 
    activeView, 
    onNavigate,
    currentUser,
    onSwitchUser,
    inboxCount
}: { 
    activeView: ViewState | 'notifications', 
    onNavigate: (v: ViewState | 'notifications') => void,
    currentUser: User,
    onSwitchUser: (u: User) => void,
    inboxCount: number
}) => {
  return (
    <div className="w-[240px] flex-shrink-0 bg-gray-50 h-full flex flex-col border-r border-gray-200 py-3 px-2 z-20">
      <div className="px-2 mb-4 flex items-center gap-2 text-gray-900 font-semibold cursor-pointer select-none">
        <div className="w-5 h-5 bg-gray-900 rounded flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
        </div>
        <span>Apple</span>
        <ChevronDown size={14} className="text-gray-400" />
      </div>

      <div className="space-y-0.5 mb-6">
        <SidebarItem icon={Search} label="Search" />
        <SidebarItem icon={Settings} label="Settings" />
      </div>

      <div className="text-[11px] font-semibold text-gray-400 px-3 mb-2 uppercase tracking-wide select-none">Workspace</div>
      
      <div className="space-y-0.5 flex-1">
        <SidebarItem 
          icon={Bell} 
          label="Notifications" 
          active={activeView === 'notifications'} 
          badge={inboxCount} 
          onClick={() => onNavigate('notifications')} 
        />
        <SidebarItem 
          icon={Building2} 
          label="Companies" 
          active={activeView === 'companies'}
          onClick={() => onNavigate('companies')}
        />
        <SidebarItem icon={Users} label="People" />
        <SidebarItem icon={Briefcase} label="Opportunities" />
        <SidebarItem icon={CheckSquare} label="Tasks" />
        <SidebarItem icon={FileText} label="Notes" />
        <SidebarItem icon={Workflow} label="Workflows" />
      </div>

      <div className="mt-auto border-t border-gray-200 pt-2">
        <button 
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left group"
            onClick={() => {
                if (currentUser.name === USERS.sofia.name) {
                    onSwitchUser(USERS.alex);
                } else {
                    onSwitchUser(USERS.sofia);
                }
            }}
            title={`Switch to ${currentUser.name === USERS.sofia.name ? 'Alex' : 'Sofia'}`}
        >
            <Avatar src={currentUser.avatar} alt={currentUser.name} />
            <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-gray-500 truncate">Workspace Admin</div>
            </div>
            <div className="p-1 rounded text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <RotateCcw size={12} />
            </div>
        </button>
      </div>
    </div>
  );
};

// --- Global Header / Filter Bar ---

const NotificationsHeader = ({ 
    filter, 
    setFilter, 
    currentUser, 
    count,
    activeNotification,
    onBack
}: { 
    filter: User | null, 
    setFilter: (u: User | null) => void, 
    currentUser: User, 
    count: number,
    activeNotification?: Task | null,
    onBack?: () => void
}) => {
    // ACTIVE STATE: Breadcrumb Header
    if (activeNotification) {
        return (
            <div className="flex-shrink-0 bg-gray-50/50 border-b border-gray-200 z-10 h-14 flex items-center justify-between px-4">
                 <div className="flex items-center gap-2 text-sm text-gray-500 overflow-hidden">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors whitespace-nowrap"
                    >
                        <Bell size={14} />
                        <span>Notifications</span>
                    </button>
                    <span className="text-gray-300">/</span>
                    <span className="font-semibold text-gray-900 truncate" title={activeNotification.title}>
                        {activeNotification.title}
                    </span>
                 </div>
                 <div className="flex items-center gap-1">
                    <button className="h-7 px-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1.5 border border-transparent hover:border-gray-300 transition-colors">
                        <Heart size={12} className="text-gray-400" /> Add to Favorites
                    </button>
                    <button className="h-7 px-2 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded flex items-center gap-1.5 border border-transparent hover:border-gray-300 transition-colors">
                        <Trash2 size={12} className="text-gray-400" /> Delete
                    </button>
                    <div className="h-4 w-px bg-gray-200 mx-1"></div>
                    <div className="flex items-center bg-white border border-gray-200 rounded-md shadow-sm">
                        <button className="p-1 hover:bg-gray-50 border-r border-gray-200 text-gray-500"><ChevronUp size={14} /></button>
                        <button className="p-1 hover:bg-gray-50 text-gray-500"><ChevronDown size={14} /></button>
                    </div>
                    <div className="ml-2 flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-500">
                            <MoreHorizontal size={16} />
                        </button>
                        <div className="h-6 px-1.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-medium text-gray-500 flex items-center justify-center gap-0.5">
                            <Command size={10} /> K
                        </div>
                    </div>
                 </div>
            </div>
        );
    }

    // DEFAULT STATE: Filter Bar
    return (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
            {/* Top Row: Title & Actions */}
            <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4">
                 <div className="flex items-center gap-2 text-gray-900 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                    <Bell size={16} className="text-gray-500" />
                    <span className="font-semibold text-sm">All Notifications</span>
                    <span className="text-gray-400 text-sm">· {count}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                 </div>
                 <div className="flex items-center gap-6">
                     <button className="text-sm text-gray-500 hover:text-gray-900 font-medium">Filter</button>
                     <button className="text-sm text-gray-500 hover:text-gray-900 font-medium">Sort</button>
                     <button className="text-sm text-gray-500 hover:text-gray-900 font-medium">Options</button>
                 </div>
            </div>

            {/* Bottom Row: Filter Bar */}
            <div className="h-10 flex items-center justify-between px-4 bg-gray-50/30">
                 <div className="flex items-center gap-2 flex-1">
                     {/* Active Filter Badge */}
                     {filter ? (
                         <div className="flex items-center bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5 text-xs font-medium gap-1.5 animate-in fade-in slide-in-from-left-2 duration-200">
                             <UserIcon size={12} className="text-blue-600" />
                             <span>Assignee: {filter.name}</span>
                             <button 
                                onClick={() => setFilter(null)}
                                className="ml-1 p-0.5 hover:bg-blue-100 rounded text-blue-500 hover:text-blue-700"
                             >
                                 <X size={12} />
                             </button>
                         </div>
                     ) : null}
                     
                     <button 
                        onClick={() => !filter && setFilter(currentUser)}
                        className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    >
                         <Plus size={14} /> Add filter
                     </button>
                 </div>

                 <div className="flex items-center gap-3">
                     <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">Cancel</button>
                     <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition-colors">
                        Update view <ChevronDown size={12} />
                     </button>
                 </div>
            </div>
        </div>
    );
}

// --- Inbox Panel ---

interface InboxCardProps {
    task: Task;
    isActive: boolean;
    onClick: () => void;
    onAssign: (updatedTask: Task) => void;
    currentUser: User;
}

const InboxCard: React.FC<InboxCardProps> = ({ 
    task, 
    isActive, 
    onClick,
    onAssign,
    currentUser
}) => {
  const [title, setTitle] = useState(task.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [assignee, setAssignee] = useState<User | null>(task.assignedTo);
  const [status, setStatus] = useState<string | null>(task.status);
  const [relations, setRelations] = useState<string[]>(task.relatedRecord ? [task.relatedRecord] : []);
  const [dueDate, setDueDate] = useState(task.dueDate);

  useEffect(() => {
    setStatus(task.status);
    setAssignee(task.assignedTo);
    setTitle(task.title);
    setRelations(task.relatedRecord ? [task.relatedRecord] : []);
    setDueDate(task.dueDate);
  }, [task]);

  const [activePicker, setActivePicker] = useState<string | null>(null);

  const togglePicker = (picker: string) => {
    setActivePicker(activePicker === picker ? null : picker);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() === '') setTitle(task.title);
  };

  const relatedCompany = COMPANIES.find(c => c.name === relations[0]);
  const companyIcon = relatedCompany?.icon;

  const getBadgeColor = (type?: string): BadgeColor => {
    switch(type) {
        case 'Email': return 'cyan';
        case 'Approval': return 'pink';
        case 'Renewal': return 'yellow';
        case 'Mention': return 'purple';
        default: return 'gray';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        p-4 border rounded-lg transition-all shadow-sm group relative cursor-pointer
        ${isActive 
          ? 'bg-white border-blue-200 ring-1 ring-blue-100 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex justify-between items-center mb-2">
         <div className="flex items-center gap-2">
            {relations.length > 0 ? (
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-medium text-gray-700">
                    <CompanyLogo name={relations[0]} url={companyIcon} />
                    <span>{relations[0]}</span>
                </div>
            ) : <div></div>}
            
             {task.type && (
                 <Badge color={getBadgeColor(task.type)}>{task.type}</Badge>
             )}
         </div>
         <span className="text-[10px] text-gray-400 whitespace-nowrap">{task.createdAtRelative || 'Just now'}</span>
      </div>

      <div className="mb-1">
        <div className="flex-1">
            {isEditingTitle ? (
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    autoFocus
                    className="text-sm font-semibold text-gray-900 w-full bg-transparent border-none p-0 focus:ring-0"
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <h3 
                    className="text-sm font-semibold text-gray-900 leading-tight hover:text-blue-600 cursor-text group/title"
                    onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
                    title="Click to edit"
                >
                  {title}
                </h3>
            )}
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {task.description}
      </p>

      {/* Editable Fields Grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs relative">
        {/* Assignee */}
        <div className="text-gray-400 flex items-center gap-1.5 h-6">
          <UserIcon size={12} /> Assigned
        </div>
        <div className="relative h-6">
            <button 
                onClick={(e) => { e.stopPropagation(); togglePicker('assignee'); }}
                className="flex items-center gap-1.5 hover:bg-gray-50 rounded px-1.5 py-0.5 -ml-1.5 transition-colors w-full text-left"
            >
                {assignee ? (
                    <>
                        <Avatar src={assignee.avatar} alt={assignee.name} />
                        <span className={`font-medium ${assignee.name === currentUser.name ? 'text-gray-900' : 'text-gray-600'}`}>
                            {assignee.name}
                        </span>
                    </>
                ) : (
                    <span className="text-gray-400 italic">No Assignee</span>
                )}
            </button>
            {activePicker === 'assignee' && (
                <div onClick={(e) => e.stopPropagation()}>
                    <AssigneePicker 
                        value={assignee} 
                        onChange={(newAssignee) => {
                            setAssignee(newAssignee);
                            const updatedTask: Task = {
                                ...task,
                                assignedTo: newAssignee,
                                status: status as any,
                                relatedRecord: relations.length > 0 ? relations[0] : '',
                                dueDate: dueDate,
                                assignedBy: currentUser
                            };
                            onAssign(updatedTask);
                        }} 
                        onClose={() => setActivePicker(null)} 
                        currentUser={currentUser}
                    />
                </div>
            )}
        </div>

        {/* Status */}
        <div className="text-gray-400 flex items-center gap-1.5 h-6">
          <CheckSquare size={12} /> Status
        </div>
        <div className="relative h-6">
             <button 
                onClick={(e) => { e.stopPropagation(); togglePicker('status'); }}
                className="flex items-center gap-1.5 hover:bg-gray-50 rounded px-1.5 py-0.5 -ml-1.5 transition-colors w-full text-left"
            >
                {status ? (
                    <Badge color={status === 'To Do' ? 'blue' : status === 'Done' ? 'green' : status === 'In Review' ? 'yellow' : status === 'In Progress' ? 'purple' : 'gray'}>
                        {status}
                    </Badge>
                ) : (
                    <span className="text-gray-400 italic">No Status</span>
                )}
            </button>
            {activePicker === 'status' && (
                <div onClick={(e) => e.stopPropagation()}>
                    <StatusPicker value={status} onChange={(s: any) => {
                        setStatus(s);
                        // Also update parent state for status changes to ensure persistence
                        const updatedTask: Task = {
                             ...task,
                             assignedTo: assignee,
                             status: s,
                             relatedRecord: relations.length > 0 ? relations[0] : '',
                             dueDate: dueDate,
                        };
                        onAssign(updatedTask);
                    }} onClose={() => setActivePicker(null)} />
                </div>
            )}
        </div>

        {/* Due Date */}
        <div className="text-gray-400 flex items-center gap-1.5 h-6">
          <Calendar size={12} /> Due Date
        </div>
        <div className="relative h-6">
            <button 
                onClick={(e) => { e.stopPropagation(); togglePicker('date'); }}
                className="flex items-center gap-1.5 hover:bg-gray-50 rounded px-1.5 py-0.5 -ml-1.5 transition-colors w-full text-left text-gray-600"
            >
                {dueDate || <span className="text-gray-400 italic">No Date</span>}
            </button>
             {activePicker === 'date' && (
                <div onClick={(e) => e.stopPropagation()}>
                    <CalendarPicker value={dueDate} onChange={(d) => {
                        setDueDate(d);
                         const updatedTask: Task = {
                             ...task,
                             assignedTo: assignee,
                             status: status as any,
                             relatedRecord: relations.length > 0 ? relations[0] : '',
                             dueDate: d,
                        };
                        onAssign(updatedTask);
                    }} onClose={() => setActivePicker(null)} />
                </div>
            )}
        </div>

        {/* Assigned By */}
        <div className="text-gray-400 flex items-center gap-1.5 h-6">
          <RotateCcw size={12} /> Assigned By
        </div>
        <div className="relative h-6 flex items-center">
             {task.assignedBy === 'System' ? (
                 <div className="flex items-center gap-1.5 px-1.5 py-0.5 -ml-1.5 text-gray-900 font-medium text-sm">
                     <Bell size={14} className="text-gray-500 fill-gray-500" />
                     System
                 </div>
             ) : task.assignedBy ? (
                 <div className="flex items-center gap-1.5 px-1.5 py-0.5 -ml-1.5">
                     <Avatar src={(task.assignedBy as User).avatar} alt={(task.assignedBy as User).name} />
                     <span className="text-gray-900 font-medium text-xs">{(task.assignedBy as User).name}</span>
                 </div>
             ) : (
                <span className="text-gray-400 italic px-1.5 -ml-1.5">Unknown</span>
             )}
        </div>

      </div>

      {!isActive && (
          <button 
              className="absolute bottom-4 right-4 h-7 w-7 bg-white hover:bg-gray-50 border border-gray-200 rounded-md shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all z-10"
              onClick={(e) => { e.stopPropagation(); }}
          >
              <ArrowUpRight size={16} />
          </button>
      )}

      {activePicker && (
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActivePicker(null); }} />
      )}
    </div>
  );
};

const InboxEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 pb-20 fade-in animate-in duration-500">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Inbox size={24} className="text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">No notifications</h3>
      <p className="text-xs text-gray-500">Adjust filters to see more tasks.</p>
    </div>
);

const InboxPanel = ({ 
    isOpen, 
    tasks, 
    onTaskClick,
    onAssignTask,
    currentUser,
    activeId
}: { 
    isOpen: boolean, 
    tasks: Task[], 
    onTaskClick: (task: Task) => void,
    onAssignTask: (updatedTask: Task) => void,
    currentUser: User,
    activeId?: string
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
        panelRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <div 
      className={`
        h-full bg-gray-50 border-r border-gray-200 overflow-hidden transition-all duration-300 ease-in-out flex flex-col z-10 flex-shrink-0
        ${isOpen ? 'w-[360px] opacity-100' : 'w-0 opacity-0'}
      `}
    >
      <div ref={panelRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-w-[360px] pt-4">
        {tasks.length > 0 ? (
            tasks.map(task => (
                <InboxCard 
                    key={task.id}
                    task={task} 
                    isActive={task.id === activeId} 
                    onClick={() => onTaskClick(task)}
                    onAssign={onAssignTask}
                    currentUser={currentUser}
                />
            ))
        ) : (
            <InboxEmptyState />
        )}
      </div>
    </div>
  );
};

// --- Workflow Panel ---

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
                            
                            {/* Trigger Step - MOVED UP */}
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

                             {/* Approval Step (Future) - ADDED */}
                             <div className="relative flex items-start gap-4 opacity-50">
                                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center z-10 flex-shrink-0">
                                    <CheckCircle2 size={16} className="text-gray-300" />
                                </div>
                                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-bold border border-gray-200">Approval</div>
                                        <div className="text-sm font-medium text-gray-900">Manager Review</div>
                                    </div>
                                    <Badge color="gray">Pending</Badge>
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

// --- Notifications Table ---

const TableHeader = ({ label, icon: Icon, width }: { label: string, icon?: any, width?: string }) => (
  <th className={`text-left text-xs font-medium text-gray-400 font-normal py-2.5 px-3 border-b border-gray-200 border-r border-dashed border-gray-200 last:border-r-0 ${width}`}>
    <div className="flex items-center gap-1.5">
      {Icon && <Icon size={13} strokeWidth={2} />}
      {label}
    </div>
  </th>
);

const TableCell = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <td className={`py-2 px-3 border-b border-gray-100 text-sm text-gray-700 whitespace-nowrap border-r border-dashed border-gray-200 last:border-r-0 ${className}`}>
    {children}
  </td>
);

const NotificationsTable = ({ notifications }: { notifications: Task[] }) => {
    // Group notifications by company
    const groupedNotifications = notifications.reduce((acc, curr) => {
        const key = curr.relatedRecord;
        if (!acc[key]) {
            acc[key] = {
                companyName: key,
                count: 0,
                items: [],
                icon: COMPANIES.find(c => c.name === key)?.icon
            };
        }
        acc[key].count++;
        acc[key].items.push(curr);
        return acc;
    }, {} as Record<string, { companyName: string, count: number, items: Task[], icon?: string }>);

    // Helper for generating tags strictly from task types
    const getUniqueTags = (items: Task[]) => {
        const tags = new Set<string>();
        items.forEach(item => {
            if (item.type) {
                tags.add(item.type);
            }
        });
        
        // Priority order: Email, Mention, Approval, Renewal
        const priority = ['Email', 'Mention', 'Approval', 'Renewal'];
        return Array.from(tags).sort((a, b) => {
             const idxA = priority.indexOf(a);
             const idxB = priority.indexOf(b);
             return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });
    };

    const getTagColor = (tag: string): BadgeColor => {
        switch (tag) {
            case 'Email': return 'cyan';
            case 'Mention': return 'purple';
            case 'Approval': return 'pink';
            case 'Renewal': return 'yellow';
            default: return 'gray';
        }
    };

    return (
        <div className="flex-1 h-full flex flex-col bg-white overflow-hidden min-w-0">
             {/* Grid */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="w-10 px-3 py-2 border-b border-gray-200 border-r border-dashed border-gray-200 sticky top-0 bg-gray-50 z-10">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </th>
                            <TableHeader label="Company Alerts" icon={Bell} width="w-64" />
                            <TableHeader label="Company" icon={Building2} width="w-48" />
                            <TableHeader label="Type" icon={Inbox} width="w-32" />
                            <TableHeader label="Creation date" icon={Calendar} />
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(groupedNotifications).map((group) => {
                            const uniqueTags = getUniqueTags(group.items);
                            // Assume first item (most recent) for creation date since grouping pushes in order
                            const mostRecentDate = group.items[0]?.createdAtRelative || 'Just now';

                            return (
                                <tr key={group.companyName} className="hover:bg-gray-50 group cursor-pointer">
                                    <td className="px-3 border-b border-gray-100 border-r border-dashed border-gray-200">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </td >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-[9px] font-bold">
                                                {group.companyName[0]}
                                            </div>
                                            <span className="font-medium text-gray-900 px-1 py-0.5 rounded bg-gray-100">
                                                {group.companyName} — {group.count} notification{group.count !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <img src={group.icon} alt="" className="w-4 h-4 rounded-sm" />
                                            <span className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs">{group.companyName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row flex-wrap gap-2 items-center">
                                            {uniqueTags.map(tag => (
                                                <React.Fragment key={tag}>
                                                    <Badge color={getTagColor(tag)}>{tag}</Badge>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {mostRecentDate}
                                    </TableCell>
                                </tr>
                            );
                        })}
                         {/* Empty row filler */}
                        <tr>
                            <td colSpan={5} className="py-2 px-4 text-xs text-gray-400 italic bg-white"></td>
                        </tr>
                        <tr className="border-t border-gray-200">
                             <td colSpan={5} className="py-2 px-4 text-xs text-gray-400 bg-white">Calculate <ChevronDown size={10} className="inline ml-1" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// --- Companies Table ---

const CompaniesTable = ({ data }: { data: Company[] }) => {
  return (
    <div className="flex-1 h-full flex flex-col bg-white overflow-hidden min-w-0">
      {/* Header Toolbar */}
      <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-gray-900 font-medium text-sm cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <span className="bg-gray-200 p-0.5 rounded"><div className="w-3 h-0.5 bg-gray-600 my-[2px]"></div><div className="w-3 h-0.5 bg-gray-600 my-[2px]"></div><div className="w-3 h-0.5 bg-gray-600 my-[2px]"></div></span>
                All
                <span className="text-gray-400 font-normal">9</span>
                <ChevronDown size={14} className="text-gray-400" />
            </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="hover:text-gray-900">Filter</button>
            <button className="hover:text-gray-900">Sort</button>
            <button className="hover:text-gray-900">Options</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="h-10 border-b border-gray-200 flex items-center px-4 gap-2 bg-gray-50/50 flex-shrink-0 overflow-x-auto no-scrollbar">
        <Badge color="blue">
           <ArrowUp size={10} /> Name <button className="ml-1 hover:bg-blue-100 rounded"><X size={10} /></button>
        </Badge>
        <Badge color="blue">
           <Search size={10} /> Any field: 1 <button className="ml-1 hover:bg-blue-100 rounded"><X size={10} /></button>
        </Badge>
        <button className="text-gray-400 text-xs flex items-center gap-1 hover:text-gray-600 whitespace-nowrap">
            <Plus size={12} /> Add filter
        </button>
        <div className="flex-1"></div>
        <button className="text-xs text-gray-500 hover:text-gray-900 mr-2">Cancel</button>
        <button className="bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1 shadow-sm whitespace-nowrap">
            Update view <ChevronDown size={12} />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="w-10 px-3 py-2 border-b border-gray-200 border-r border-dashed border-gray-200 sticky top-0 bg-gray-50 z-10">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <TableHeader label="Companies" icon={Building2} width="w-48" />
              <TableHeader label="Url" icon={CornerUpRight} width="w-40" />
              <TableHeader label="Created By" icon={UserIcon} width="w-40" />
              <TableHeader label="Address" icon={Building2} width="w-48" />
              <TableHeader label="Account Owner" icon={UserIcon} width="w-40" />
              <TableHeader label="ICP" icon={CheckCircle2} width="w-24" />
              <TableHeader label="ARR" icon={Briefcase} width="w-32" />
              <TableHeader label="Linkedin" icon={Users} />
            </tr>
          </thead>
          <tbody>
            {data.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 group">
                <td className="px-3 border-b border-gray-100 border-r border-dashed border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img src={company.icon} alt="" className="w-4 h-4 rounded-sm" />
                    <span className="font-medium text-gray-900">{company.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600 border border-gray-200">
                      {company.url}
                  </span>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar src={company.createdBy.avatar} alt={company.createdBy.name} />
                        <span className="text-gray-600 truncate">{company.createdBy.name}</span>
                    </div>
                </TableCell>
                <TableCell className="text-gray-500 truncate max-w-[200px]">{company.address}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar src={company.accountOwner.avatar} alt={company.accountOwner.name} />
                        <span className="text-gray-600 truncate">{company.accountOwner.name}</span>
                    </div>
                </TableCell>
                <TableCell>
                    {company.isICP ? <span className="text-gray-600 flex items-center gap-1"><CheckSquare size={12} /> True</span> : <span className="text-gray-400 flex items-center gap-1"><X size={12} /> False</span>}
                </TableCell>
                <TableCell className="text-right font-mono text-gray-600 text-xs">{company.arr}</TableCell>
                <TableCell>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600 border border-gray-200">
                        {company.linkedin}
                    </span>
                </TableCell>
              </tr>
            ))}
            {/* Empty rows to fill space if needed */}
            <tr>
               <td colSpan={9} className="py-2 px-4 text-xs text-gray-400 italic bg-white">Loading more...</td>
            </tr>
            <tr className="border-t border-gray-200">
               <td colSpan={9} className="py-2 px-4 text-xs text-gray-400 bg-white">Calculate <ChevronDown size={10} className="inline ml-1" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Record View (Email/Workflow Context) ---

const RecordView = ({ 
  onClose,
  onOpenWorkflow,
  tasks,
  activeNotification,
  onBackToNotifications,
  isWorkflowOpen
}: { 
  onClose: () => void,
  onOpenWorkflow: () => void,
  tasks: Task[],
  activeNotification?: Task | null,
  onBackToNotifications?: () => void,
  isWorkflowOpen?: boolean
}) => {
  const company = COMPANIES.find(c => c.id === 'target') || COMPANIES[0];
  
  // Use active notification if available, otherwise fallback to the main Inbox task for the demo.
  // This logic ensures the button state (View Workflow vs Respond) is reactive to the specific task being viewed.
  const currentTask = activeNotification || tasks.find(t => t.id === INBOX_TASK.id);
  const isDone = currentTask?.status === 'Done';

  return (
    <div className="flex-1 h-full flex flex-col bg-white min-w-0">
      {/* Header - Only shown if activeNotification is NOT set, because global header takes over in that case */}
      {!activeNotification && (
       <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
                <img src="https://logo.clearbit.com/target.com" className="w-5 h-5 object-contain" alt="Target" onError={(e) => e.currentTarget.style.display='none'} />
             </div>
             <div>
                <h1 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                   {company.name}
                   <span className="text-xs font-normal text-gray-400">Created 3 days ago</span>
                </h1>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50">
                <X size={18} />
             </button>
          </div>
       </div>
      )}

       {/* Tabs */}
       <div className="px-6 border-b border-gray-200 flex items-center gap-6 overflow-x-auto no-scrollbar bg-white flex-shrink-0">
          {['Home', 'Tasks', 'Notes', 'Files', 'Emails', 'Calendar'].map((tab) => (
             <button 
                key={tab}
                className={`
                   py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                   ${tab === 'Emails' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}
                `}
             >
                {tab === 'Home' && <Home size={14} />}
                {tab === 'Tasks' && <CheckSquare size={14} />}
                {tab === 'Notes' && <FileText size={14} />}
                {tab === 'Files' && <Paperclip size={14} />}
                {tab === 'Emails' && <Mail size={14} />}
                {tab === 'Calendar' && <Calendar size={14} />}
                {tab}
             </button>
          ))}
       </div>

       {/* Scrollable Content */}
       <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
           <div className="max-w-4xl mx-auto w-full">
             {/* Main Column */}
             <div className="space-y-6">
                {/* Email Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Email Header */}
                    <div className="p-4 border-b border-gray-100 flex items-start gap-4">
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Q1 Renewal Discussion</h2>
                            <div className="text-xs text-gray-500 mt-0.5">Email • Received 4 hours ago</div>
                        </div>
                    </div>

                    {/* Collapsed Thread */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50/30">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Avatar src={USERS.alex.avatar} alt="Alex" />
                                <span className="text-sm font-medium text-gray-900">Alex Schiller</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"><Paperclip size={12} /></div>
                                <span className="text-xs text-gray-400">3 days ago</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1 pl-7">
                            Great speaking earlier as well. Yes, a multi-year commitment should unlock some flexibility on pricing. Once you have a...
                        </p>
                    </div>
                    
                    {/* Expansion Button */}
                    <div className="px-4 py-2 border-b border-gray-100">
                        <button className="text-xs font-medium text-gray-500 flex items-center gap-2 hover:text-gray-700">
                            <div className="p-1 rounded hover:bg-gray-100 border border-gray-200"><ArrowDownUp size={10} /></div>
                            4 emails
                        </button>
                    </div>

                    {/* Active Email */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Avatar src={USERS.steve.avatar} alt="Steve" />
                                <div>
                                <div className="text-sm font-semibold text-gray-900">Steve Anavi</div>
                                <div className="text-xs text-gray-500">to: me, Alexandre <ChevronDown size={10} className="inline" /></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"><Paperclip size={12} /></div>
                                <span className="text-xs text-gray-400">3 days ago</span>
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-800 space-y-4 leading-relaxed pl-7">
                            <p>Hi Alex,</p>
                            <p>We're finalizing our Q1 contract renewal and wanted to confirm updated pricing before our internal review.</p>
                            <p>Could you share:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>The current annual rate</li>
                                <li>Any volume discounts for a multi-year term</li>
                                <li>Whether the proposed discount we discussed still applies</li>
                            </ul>
                            <p>Hoping to close this by the end of the month.</p>
                            <p>Thanks,<br/>Steve<br/>Target Corporation</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                            <Reply size={14} className="text-gray-500" />
                            Reply (View in Gmail)
                        </button>
                        <div className="flex flex-col items-end gap-1">
                            {!isWorkflowOpen && (
                                <button 
                                    onClick={onOpenWorkflow}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors ${isDone ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                >
                                    <Sparkles size={14} />
                                    {isDone ? 'View Workflow Run' : 'Respond to Pricing Inquiry (Q1 Renewal)'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
             </div>
           </div>
       </div>
    </div>
  );
};

// --- Main App Layout ---

// Define initial dataset
const INITIAL_NOTIFICATIONS: Task[] = [
    {
        id: 'task-target',
        title: 'Send pricing confirmation',
        description: 'Incoming email asking to confirm pricing structure and volume discounts for Q1 budget approval.',
        relatedRecord: 'Target',
        relatedRecordId: 'target',
        assignedTo: USERS.alex,
        status: 'To Do',
        dueDate: 'Today',
        type: 'Email',
        createdAtRelative: 'Just now',
        assignedBy: 'System'
    },
    {
        id: 'task-target-2',
        title: 'Contract review',
        description: 'Legal team comments on the Q1 renewal draft need attention.',
        relatedRecord: 'Target',
        relatedRecordId: 'target',
        assignedTo: USERS.sofia,
        status: 'In Review',
        dueDate: 'Tomorrow',
        type: 'Approval',
        createdAtRelative: '2h ago',
        assignedBy: 'System'
    },
    {
        id: 'task-target-3',
        title: 'Q1 Sync',
        description: 'Schedule quarterly sync with stakeholders.',
        relatedRecord: 'Target',
        relatedRecordId: 'target',
        assignedTo: null,
        status: 'Done',
        dueDate: 'Yesterday',
        type: 'Renewal',
        createdAtRelative: 'Yesterday',
        assignedBy: USERS.sofia
    },
    {
        id: 'task-airbnb-1',
        title: 'Host policy update',
        description: 'Review new host policy requirements for upcoming season.',
        relatedRecord: 'Airbnb',
        relatedRecordId: '2',
        assignedTo: USERS.alex,
        status: 'To Do',
        dueDate: 'Today',
        type: 'Email',
        createdAtRelative: '3m ago',
        assignedBy: 'System'
    },
    {
        id: 'task-stripe-1',
        title: 'API Usage',
        description: 'Unusual spike in API usage detected.',
        relatedRecord: 'Stripe',
        relatedRecordId: '8',
        assignedTo: USERS.sofia,
        status: 'To Do',
        dueDate: 'Today',
        type: 'Mention',
        createdAtRelative: '1h ago',
        assignedBy: 'System'
    },
    {
        id: 'task-stripe-2',
        title: 'Invoice check',
        description: 'Confirm invoice #4421 has been paid.',
        relatedRecord: 'Stripe',
        relatedRecordId: '8',
        assignedTo: USERS.alex,
        status: 'Done',
        dueDate: 'Yesterday',
        type: 'Email',
        createdAtRelative: '5h ago',
        assignedBy: 'System'
    },
    {
        id: 'task-slack-1',
        title: 'New integration',
        description: 'Approve new integration request from Engineering.',
        relatedRecord: 'Slack',
        relatedRecordId: '3',
        assignedTo: null,
        status: 'Done',
        dueDate: 'Yesterday',
        type: 'Approval',
        createdAtRelative: 'Yesterday',
        assignedBy: 'System'
    }
];

const App = () => {
  const [currentUser, setCurrentUser] = useState<User>(USERS.alex);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [workflowView, setWorkflowView] = useState<'input' | 'overview' | 'review'>('input');
  const [workflowStatus, setWorkflowStatus] = useState<'running' | 'completed'>('running');
  
  const [view, setView] = useState<ViewState | 'notifications'>('companies');
  const [lastView, setLastView] = useState<ViewState | 'notifications'>('companies');
  
  // Unified Notification State
  const [notifications, setNotifications] = useState<Task[]>(INITIAL_NOTIFICATIONS);
  // Shared Filter State
  const [filterAssignee, setFilterAssignee] = useState<User | null>(currentUser);
  
  // Active Notification ID (Single Source of Truth)
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);

  // Derived Active Notification
  const activeNotification = activeNotificationId ? notifications.find(t => t.id === activeNotificationId) || null : null;

  // Filter logic: Exclude 'Done', then apply Assignee filter
  const filteredNotifications = notifications.filter(n => {
      if (n.status === 'Done') return false;
      if (filterAssignee && n.assignedTo?.name !== filterAssignee.name) return false;
      return true;
  });

  const [showBanner, setShowBanner] = useState<{ visible: boolean, message: string }>({ visible: false, message: '' });

  // Compute counts using filteredNotifications for badges
  const inboxCount = filteredNotifications.length;

  const handleNavigation = (targetView: ViewState | 'notifications') => {
      if (targetView === 'notifications') {
          setView('notifications');
          setIsInboxOpen(true);
          setFilterAssignee(currentUser); // Ensure filter is 'Me' on entry
      } else {
          setView(targetView);
          setIsInboxOpen(false);
      }
      setActiveNotificationId(null); // Always clear active notification on navigation change from sidebar
  };
  
  const handleBackToNotifications = () => {
      setActiveNotificationId(null);
      // We are essentially staying in notification view context but resetting selection
      // If we want to return to table view, we ensure view is 'notifications'
      if (view === 'record') {
          setView('notifications');
      }
      setIsInboxOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setActiveNotificationId(task.id);
    if (view !== 'record') {
        setLastView(view);
    }
    setView('record');
    
    // NEW: Close inbox panel to focus on the task
    setIsInboxOpen(true);
    
    // If status is 'In Review', open workflow panel in 'review' mode immediately
    if (task.status === 'In Review') {
        setWorkflowView('review');
        setIsWorkflowOpen(true);
    } else if (task.status === 'In Progress') {
        setWorkflowView('input');
        setIsWorkflowOpen(true);
    } else if (task.status === 'Done') {
        setWorkflowView('overview');
        setWorkflowStatus('completed');
        setIsWorkflowOpen(true);
    }
  };

  const handleOpenWorkflow = () => {
      // Find the target task - prioritize active, fallback to INBOX_TASK for demo purposes if active isn't found
      const targetId = activeNotificationId || INBOX_TASK.id;
      const task = notifications.find(t => t.id === targetId);

      if (task?.status === 'Done') {
          setWorkflowView('overview');
          setWorkflowStatus('completed');
      } else if (task?.status === 'In Review') {
          setWorkflowView('review');
      } else {
          setWorkflowView('input');
      }
      setIsWorkflowOpen(true);

      // Explicitly update status to 'In Progress' if it is 'To Do'
      if (task && task.status === 'To Do') {
          setNotifications(prev => prev.map(t => 
             t.id === targetId ? { ...t, status: 'In Progress' } : t
          ));
      }
  };

  const handleCloseWorkflow = () => {
      setIsWorkflowOpen(false);
  };

  const handleRequestReview = () => {
      // Update Task (Status: 'In Review', Assignee: Alex, Type: 'Approval')
      // Use activeNotificationId if available, else INBOX_TASK.id
      const targetId = activeNotificationId || INBOX_TASK.id;
      const updatedTask = notifications.find(t => t.id === targetId);
      
      if (updatedTask) {
          const taskForAlex = { 
              ...updatedTask, 
              status: 'In Review' as const, 
              assignedTo: USERS.alex, 
              type: 'Approval' as const,
              assignedBy: currentUser
          };

          setNotifications(prev => prev.map(t => t.id === targetId ? taskForAlex : t));
          
          setIsWorkflowOpen(true);
          setWorkflowView('overview');
          setWorkflowStatus('running');
          
          setShowBanner({ visible: true, message: 'Review Request Sent.' });
      }
  };

  const handleApprove = () => {
      const targetId = activeNotificationId || INBOX_TASK.id;
      const updatedTask = notifications.find(t => t.id === targetId);
      if (updatedTask) {
         setNotifications(prev => prev.map(t => 
            t.id === targetId ? { ...t, status: 'Done' } : t
         ));
         setWorkflowView('overview');
         setWorkflowStatus('completed');
         setIsWorkflowOpen(true);
         
         setShowBanner({ visible: true, message: 'Pricing Approved & Email Sent.' });
         setTimeout(() => setShowBanner(prev => ({ ...prev, visible: false })), 5000);
      }
  }

  const handleAssignTask = (updatedTask: Task) => {
    // Update the single source of truth
    setNotifications(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

    const assignee = updatedTask.assignedTo;
    if (assignee && assignee.name !== currentUser.name) {
         setShowBanner({ visible: true, message: `Task Assigned to ${assignee.name.split(' ')[0]}.` });
         setTimeout(() => setShowBanner(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const handleSwitchUser = (user: User) => {
      setCurrentUser(user);
      setShowBanner({ visible: false, message: '' });
      setIsInboxOpen(false);
      setIsWorkflowOpen(false);
      setWorkflowStatus('running');
      setView('companies'); // Default view on switch
      setFilterAssignee(user);
      setActiveNotificationId(null);
  };

  // Determine tasks to display in inbox panel based on active state
  // We re-derive activeNotification from the ID here to ensure we pass the LATEST object
  const currentActiveNotification = activeNotificationId ? notifications.find(t => t.id === activeNotificationId) : null;
  const inboxTasks = currentActiveNotification ? [currentActiveNotification] : filteredNotifications;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 relative">
      
      {/* Success Banner */}
      {showBanner.visible && (
          <div className="absolute top-0 left-0 right-0 h-10 bg-blue-600 text-white flex items-center justify-center gap-4 text-sm font-medium animate-in slide-in-from-top-2 z-50 shadow-md">
              <span>{showBanner.message}</span>
              <button className="px-3 py-0.5 border border-white/30 rounded hover:bg-white/10 text-xs flex items-center gap-1 transition-colors">
                  <RotateCcw size={12} /> Undo
              </button>
          </div>
      )}

      {/* 1. Left Sidebar */}
      <Sidebar 
        onNavigate={handleNavigation} 
        activeView={view} 
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        inboxCount={inboxCount}
      />

      {/* Main Area Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 h-full relative ${showBanner.visible ? 'pt-10' : ''} transition-all duration-300 ease-in-out`}>
          
          {/* Global Filter Bar / Active Notification Header */}
          {/* Render if in Notifications view OR if we have an active notification selected */}
          {(view === 'notifications' || currentActiveNotification) && (
              <NotificationsHeader 
                  filter={filterAssignee} 
                  setFilter={setFilterAssignee} 
                  currentUser={currentUser} 
                  count={inboxCount}
                  activeNotification={currentActiveNotification}
                  onBack={handleBackToNotifications}
              />
          )}

          {/* Split Content: Inbox + Main Table/View */}
          <div className="flex-1 flex overflow-hidden relative">
              
              {/* Inbox Panel (Sliding) */}
              <InboxPanel 
                isOpen={isInboxOpen} 
                tasks={inboxTasks}
                onTaskClick={handleTaskClick} 
                onAssignTask={handleAssignTask}
                currentUser={currentUser}
                activeId={activeNotificationId || undefined}
              />

              {/* Main Content (Table / Record) */}
              <div className="flex-1 flex flex-col min-w-0 bg-white">
                {view === 'notifications' ? (
                   <NotificationsTable notifications={filteredNotifications} />
                ) : view === 'companies' ? (
                   <CompaniesTable data={COMPANIES} />
                ) : (
                   <RecordView 
                     onClose={() => handleNavigation(lastView as any)} 
                     onOpenWorkflow={handleOpenWorkflow}
                     tasks={notifications}
                     activeNotification={currentActiveNotification}
                     onBackToNotifications={handleBackToNotifications}
                     isWorkflowOpen={isWorkflowOpen}
                   />
                )}
              </div>
          </div>
      </div>
      
      {/* 4. Right Workflow Panel */}
      <div className={`${showBanner.visible ? 'pt-10' : ''} h-full transition-all duration-300 ease-in-out`}>
          <WorkflowPanel 
            isOpen={isWorkflowOpen} 
            onClose={handleCloseWorkflow} 
            viewState={workflowView}
            onRequestReview={handleRequestReview}
            currentUser={currentUser}
            onApprove={handleApprove}
            status={workflowStatus}
          />
      </div>
    </div>
  );
};

export default App;