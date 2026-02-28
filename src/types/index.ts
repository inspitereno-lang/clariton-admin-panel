// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  brand: string;
  sku: string;
  status: 'Active' | 'Draft' | 'OOS';
}

// Store Types
export interface OperatingHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactNumber: string;
  email: string;
  images: string[];
  operatingHours: OperatingHours;
  mapUrl: string;
  status: 'Open' | 'Closed' | 'Renovation';
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  brand: string;
  status: 'Active' | 'Draft' | 'OOS';
  images: File[];
}

export interface StoreFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactNumber: string;
  email: string;
  mapUrl: string;
  status: 'Open' | 'Closed' | 'Renovation';
  images: File[];
  operatingHours: OperatingHours;
}
