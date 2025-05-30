export interface Participant {
  id: string;
  name: string;
  color?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sharedBy: string[]; // Array of participant IDs
  notes?: string;
}

export interface Bill {
  id: string;
  restaurantName?: string;
  date: string;
  items: MenuItem[];
  participants: Participant[];
  serviceCharge: number;
  tax: number;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sharedBy: string[]; // participant IDs
}
