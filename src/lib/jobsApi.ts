/**
 * API client for job-related operations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

export interface Job {
  id: number;
  title: string;
  companyName: string;
  location: string;
  externalId: string;
  externalUrl: string;
  source: string;
  employmentType: string;
  description: string;
  publishedAt: string;
  deadline: string;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
  skills: {
    id: number;
    name: string;
  }[];
}

export interface JobsPage {
  content: Job[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface SyncStatus {
  inProgress: boolean;
  totalJobsSynced: number;
  lastSyncStart: string | null;
  lastSyncEnd: string | null;
  status: string;
}

/**
 * Fetch jobs with pagination and filters
 */
export async function fetchJobs(params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  query?: string;
  location?: string;
  employmentType?: string;
}): Promise<JobsPage> {
  const {
    page = 0,
    size = 20,
    sortBy = 'createdAt',
    sortDir = 'desc',
    query = '',
    location = '',
    employmentType = ''
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir,
  });

  if (query) searchParams.append('query', query);
  if (location) searchParams.append('location', location);
  if (employmentType && employmentType !== 'all') {
    searchParams.append('employmentType', employmentType);
  }

  const response = await fetch(`${API_BASE_URL}/jobs/search?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single job by ID
 */
export async function fetchJobById(id: number): Promise<Job> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch job: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Start batch sync
 */
export async function startBatchSync(maxJobsPerMunicipality: number = 100): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/jobs/sync/batch?maxJobsPerMunicipality=${maxJobsPerMunicipality}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error(`Failed to start batch sync: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<SyncStatus> {
  const response = await fetch(`${API_BASE_URL}/jobs/sync/status`);

  if (!response.ok) {
    throw new Error(`Failed to fetch sync status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Start regular sync (smaller batch)
 */
export async function startSync(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/jobs/sync`, { method: 'POST' });

  if (!response.ok) {
    throw new Error(`Failed to start sync: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Idag';
  if (diffDays === 1) return '1 dag sedan';
  if (diffDays < 7) return `${diffDays} dagar sedan`;
  if (diffDays < 14) return '1 vecka sedan';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} veckor sedan`;

  return date.toLocaleDateString('sv-SE');
}

/**
 * Calculate days remaining until deadline
 */
export function daysUntilDeadline(deadlineString: string | null): string {
  if (!deadlineString) return 'Ingen deadline';

  const deadline = new Date(deadlineString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Utgången';
  if (diffDays === 0) return 'Sista dagen';
  if (diffDays === 1) return '1 dag kvar';

  return `${diffDays} dagar kvar`;
}
