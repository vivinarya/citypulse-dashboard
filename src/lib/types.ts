export type ReportCategory =
  | 'Pothole'
  | 'Broken Streetlight'
  | 'Sanitation'
  | 'Blocked Drain / Water Logging'
  | 'Road Obstruction'
  | 'Traffic Signal Issue'
  | 'Vandalism'
  | 'Missing Manhole / Drain Cover'
  | 'Other';

export type ReportStatus = 'Submitted' | 'In Progress' | 'Resolved' | 'Rejected';

export type Report = {
  id: string;
  category: ReportCategory;
  department: string;
  description: string;
  imageUrls: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: ReportStatus;
  timestamp: string;
  userId: string;
  resolutionTime?: number;
};
