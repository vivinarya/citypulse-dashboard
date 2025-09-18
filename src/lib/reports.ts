import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  onSnapshot,
  query,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import type { Report, ReportStatus } from './types';

function processReportDoc(doc: DocumentData): Report {
  const data = doc.data();
  const firestoreTimestamp = data.timestamp as Timestamp;
  const date = firestoreTimestamp ? firestoreTimestamp.toDate() : new Date();

  return {
    id: doc.id,
    category: data.category,
    department: data.department,
    description: data.description,
    imageUrls: data.imageUrls || [],
    location: {
      latitude: data.location?.latitude ?? 0,
      longitude: data.location?.longitude ?? 0,
      address:
        data.address ||
        `${data.location?.latitude ?? 'N/A'}, ${
          data.location?.longitude ?? 'N/A'
        }`,
    },
    status: data.status,
    timestamp: date.toISOString(),
    userId: data.userId,
    resolutionTime: data.resolutionTime,
  };
}

export function listenToReports(
  callback: (reports: Report[]) => void
): () => void {
  const reportsQuery = query(collection(db, 'reports'));

  const unsubscribe = onSnapshot(
    reportsQuery,
    (querySnapshot: QuerySnapshot) => {
      const reportList = querySnapshot.docs.map(processReportDoc);
      callback(reportList);
    },
    (error) => {
      console.error('Error listening to reports:', error);
    }
  );

  return unsubscribe;
}

export function listenToReportById(
  id: string,
  callback: (report: Report | null) => void
): () => void {
  const reportRef = doc(db, 'reports', id);

  const unsubscribe = onSnapshot(
    reportRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(processReportDoc(docSnap));
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Error listening to report ${id}:`, error);
    }
  );

  return unsubscribe;
}

export async function getReports(): Promise<Report[]> {
  const reportsCol = collection(db, 'reports');
  const reportSnapshot = await getDocs(reportsCol);
  const reportList = reportSnapshot.docs.map(processReportDoc);
  return reportList;
}

export async function getReportById(id: string): Promise<Report | null> {
  const reportRef = doc(db, 'reports', id);
  const reportSnap = await getDoc(reportRef);

  if (!reportSnap.exists()) {
    return null;
  }
  return processReportDoc(reportSnap);
}


export async function updateReportStatus(id: string, status: ReportStatus, resolutionTime?: number): Promise<void> {
    const reportRef = doc(db, 'reports', id);
    const dataToUpdate: { status: ReportStatus, resolutionTime?: number } = { status };
    if (resolutionTime !== undefined) {
      dataToUpdate.resolutionTime = resolutionTime;
    }
    await updateDoc(reportRef, dataToUpdate);
}
