
export interface Soldier {
  id: string;
  fullName: string;
  personalNumber: string;
  idNumber: string;
  phone: string;
  gender: 'ז' | 'נ';
  rank: string;
  serviceType: 'סדיר' | 'מיל' | 'יועץ';
  center: string;
  branch: string;
  department: string;
  team?: string;
  position: string;
  requiresApproval: boolean;
  hasIntelligenceWatch: boolean;
  securityClearance: string;
  hasAllergy: boolean;
}

export interface BaseRequest {
  id: string;
  type: 'single-day' | 'multi-day' | 'replacement' | 'departure';
  soldierId: string;
  createdDate: string;
  commanderName: string;
  status: 'ממתינה' | 'אושרה' | 'נדחתה';
  message: string;
}

export interface SingleDayRequest extends BaseRequest {
  type: 'single-day';
  arrivalDate: string;
  requiresApproval: boolean;
  baseName: string;
  wasInBaseBefore: boolean;
}

export interface MultiDayRequest extends BaseRequest {
  type: 'multi-day';
  arrivalDate: string;
  departureDate: string;
  requiresApproval: boolean;
  baseName: string;
  wasInBaseBefore: boolean;
}

export interface ReplacementRequest extends BaseRequest {
  type: 'replacement';
  arrivalDate: string;
  departureDate: string;
  requiresApproval: boolean;
  baseName: string;
  wasInBaseBefore: boolean;
  replacedSoldier: {
    fullName: string;
    personalNumber: string;
    rank: string;
    position: string;
    departureDate: string;
  };
}

export interface DepartureRequest extends BaseRequest {
  type: 'departure';
  baseName: string;
}

export type Request = SingleDayRequest | MultiDayRequest | ReplacementRequest | DepartureRequest;
