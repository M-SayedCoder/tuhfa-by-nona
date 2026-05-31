/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: "mirrors" | "trays" | "contracts" | "accessories";
  categoryAr: string;
  description: string;
  price?: string; // e.g. "حسب المقاس والتصميم" or "يبدأ من 450 ج.م"
  imageUrl: string;
  features: string[];
  prepTimeDays?: number;
  rating?: number;
  ratingCount?: number;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: "mirrors" | "trays" | "contracts" | "accessories" | "all";
  title: string;
  description: string;
  size?: string;
  materials?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number; // 1 to 5
  date: string;
}

export interface TimelineStep {
  year: string;
  title: string;
  description: string;
  iconName: string;
}

export interface CustomOrder {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  occasionType: string;
  mainColor: string;
  customText: string;
  details: string;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "canceled";
  createdAt: string;
  metroStation?: string;
  createdAtRaw?: string;
  priceEGP?: number;
  isVerifiedClient?: boolean;
}

export interface MetroStation {
  name: string;
  line: string;
  badge: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  phone?: string;
  password?: string; // Stored locally
  isAdmin: boolean;
  email?: string;
  isVerifiedClient?: boolean;
  isPhoneVerified?: boolean;
  verificationDate?: string;
}