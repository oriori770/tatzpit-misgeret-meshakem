
import { useState, useEffect } from 'react';
import { Soldier, Request } from '@/types';

const SOLDIERS_STORAGE_KEY = 'soldiers_data';
const REQUESTS_STORAGE_KEY = 'requests_data';

const defaultSoldiers: Soldier[] = [
  {
    id: '1',
    fullName: 'יוסי כהן',
    personalNumber: '1234567',
    idNumber: '123456789',
    phone: '050-1234567',
    gender: 'ז',
    rank: 'רס"ר',
    serviceType: 'סדיר',
    center: 'מרכז צפון',
    branch: 'חיל האוויר',
    department: 'מודיעין',
    team: 'צוות א',
    position: 'מפעיל מערכות',
    requiresApproval: true,
    hasIntelligenceWatch: false,
    securityClearance: 'סודי',
    hasAllergy: false,
  },
  {
    id: '2',
    fullName: 'שרה לוי',
    personalNumber: '2345678',
    idNumber: '234567890',
    phone: '052-2345678',
    gender: 'נ',
    rank: 'סמ"ר',
    serviceType: 'מיל',
    center: 'מרכז דרום',
    branch: 'חיל הים',
    department: 'תקשורת',
    position: 'קצינת תקשורת',
    requiresApproval: false,
    hasIntelligenceWatch: true,
    securityClearance: 'חסוי',
    hasAllergy: true,
  }
];

export function useData() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const storedSoldiers = localStorage.getItem(SOLDIERS_STORAGE_KEY);
    if (storedSoldiers) {
      setSoldiers(JSON.parse(storedSoldiers));
    } else {
      setSoldiers(defaultSoldiers);
      localStorage.setItem(SOLDIERS_STORAGE_KEY, JSON.stringify(defaultSoldiers));
    }

    const storedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  const addSoldier = (soldier: Omit<Soldier, 'id'>) => {
    const newSoldier = { ...soldier, id: Date.now().toString() };
    const updatedSoldiers = [...soldiers, newSoldier];
    setSoldiers(updatedSoldiers);
    localStorage.setItem(SOLDIERS_STORAGE_KEY, JSON.stringify(updatedSoldiers));
  };

  const addRequest = (request: Omit<Request, 'id'>) => {
    const newRequest = { ...request, id: Date.now().toString() } as Request;
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const updateRequestStatus = (requestId: string, status: 'ממתינה' | 'אושרה' | 'נדחתה') => {
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, status } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const getSoldierById = (id: string) => {
    return soldiers.find(soldier => soldier.id === id);
  };

  return {
    soldiers,
    requests,
    addSoldier,
    addRequest,
    updateRequestStatus,
    getSoldierById,
  };
}
