export interface Company {
  id: string;
  name: string;
  icon: string;
  url: string;
  createdBy: User;
  address: string;
  accountOwner: User;
  isICP: boolean;
  arr: string;
  linkedin: string;
}

export interface User {
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  relatedRecord: string;
  relatedRecordId: string;
  assignedTo: User | null;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done' | null;
  dueDate: string;
  type?: 'Email' | 'Approval' | 'Renewal' | 'Mention';
  createdAtRelative?: string;
  assignedBy?: User | 'System';
}

export type ViewState = 'companies' | 'record';
export type WorkflowState = 'closed' | 'input' | 'processing' | 'completed';