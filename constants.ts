import { Company, Task, User } from './types';

export const USERS: Record<string, User> = {
  phil: { name: 'Phil Schiller', avatar: 'https://picsum.photos/id/1/32/32' },
  craig: { name: 'Craig Federighi', avatar: 'https://picsum.photos/id/2/32/32' },
  eddy: { name: 'Eddy Cue', avatar: 'https://picsum.photos/id/3/32/32' },
  katherine: { name: 'Katherine Adams', avatar: 'https://picsum.photos/id/4/32/32' },
  tim: { name: 'Tim Cook', avatar: 'https://picsum.photos/id/5/32/32' },
  jeff: { name: 'Jeff Williams', avatar: 'https://picsum.photos/id/6/32/32' },
  steve: { name: 'Steve Anavi', avatar: 'https://picsum.photos/id/7/32/32' },
  alex: { name: 'Alex Schiller', avatar: 'https://picsum.photos/id/9/32/32' },
  sofia: { name: 'Sofia Martinez', avatar: 'https://picsum.photos/id/10/32/32' },
  kalista: { name: 'Kalista Joy', avatar: 'https://picsum.photos/id/11/32/32' },
  system: { name: 'System', avatar: 'https://picsum.photos/id/8/32/32' },
};

export const COMPANIES: Company[] = [
  { id: '1', name: 'Anthropic', icon: 'https://logo.clearbit.com/anthropic.com', url: 'anthropic.com', createdBy: USERS.jeff, address: '18 Rue De Navarin', accountOwner: USERS.phil, isICP: true, arr: '$500,000', linkedin: 'anthropic' },
  { id: '2', name: 'Linkedin', icon: 'https://logo.clearbit.com/linkedin.com', url: 'linkedin.com', createdBy: USERS.craig, address: '1226 Moises Causeway', accountOwner: USERS.craig, isICP: false, arr: '$1,000,000', linkedin: 'linkedin' },
  { id: 'target', name: 'Target', icon: 'https://logo.clearbit.com/target.com', url: 'target.com', createdBy: USERS.system, address: '1000 Nicollet Mall', accountOwner: USERS.tim, isICP: true, arr: '$50,000,000', linkedin: 'target' },
  { id: '3', name: 'Slack', icon: 'https://logo.clearbit.com/slack.com', url: 'slack.com', createdBy: USERS.eddy, address: '1316 Dameon Mount', accountOwner: USERS.katherine, isICP: true, arr: '$2,300,000', linkedin: 'slack' },
  { id: '4', name: 'Notion', icon: 'https://logo.clearbit.com/notion.com', url: 'notion.com', createdBy: USERS.system, address: '1162 Sammy Creek', accountOwner: USERS.phil, isICP: false, arr: '$750,000', linkedin: 'notion' },
  { id: '5', name: 'Figma', icon: 'https://logo.clearbit.com/figma.com', url: 'figma.com', createdBy: USERS.system, address: '110 Oswald Junction', accountOwner: USERS.tim, isICP: true, arr: '$3,500,000', linkedin: 'figma' },
  { id: '6', name: 'Github', icon: 'https://logo.clearbit.com/github.com', url: 'github.com', createdBy: USERS.jeff, address: '3891 Ranchview Dr', accountOwner: USERS.jeff, isICP: true, arr: '$900,000', linkedin: 'github' },
  { id: '7', name: 'Airbnb', icon: 'https://logo.clearbit.com/airbnb.com', url: 'airbnb.com', createdBy: USERS.tim, address: '4517 Washington Ave', accountOwner: USERS.eddy, isICP: true, arr: '$4,200,000', linkedin: 'airbnb' },
  { id: '8', name: 'Stripe', icon: 'https://logo.clearbit.com/stripe.com', url: 'stripe.com', createdBy: USERS.katherine, address: '2118 Thornridge Cir', accountOwner: USERS.tim, isICP: true, arr: '$1,800,000', linkedin: 'stripe' },
  { id: '9', name: 'Sequoia', icon: 'https://logo.clearbit.com/sequoiacap.com', url: 'sequoia.com', createdBy: USERS.phil, address: '1316 Dameon Mount', accountOwner: USERS.phil, isICP: false, arr: '$6,000,000', linkedin: 'sequoia' },
  { id: '10', name: 'Segment', icon: 'https://logo.clearbit.com/segment.com', url: 'segment.com', createdBy: USERS.phil, address: '8502 Preston Rd', accountOwner: USERS.eddy, isICP: true, arr: '$2,750,000', linkedin: 'segment' },
];

export const INBOX_TASK: Task = {
  id: 'task-target',
  title: 'Send pricing confirmation',
  description: 'Incoming email asking to confirm pricing structure and volume discounts for Q1 budget approval.',
  relatedRecord: 'Target', 
  relatedRecordId: 'target', 
  assignedTo: USERS.alex,
  status: 'To Do',
  dueDate: '',
  type: 'Email',
  assignedBy: 'System'
};