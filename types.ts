
export interface ReceiptItem {
  id: string;
  description: string;
  qty: number;
  customerGrossWeight: number;
  customerNetWeight: number;
  centreGrossWeight: number;
  centreNetWeight: number;
  declaredPurity: string;
  remarks: string;
}

export interface ReceiptData {
  id: string;
  receiptNo: string;
  receivedFrom: string;
  bisCertificateNo: string;
  date: string;
  time: string;
  items: ReceiptItem[];
  dcNo: string;
  dcDate: string;
  createdAt: number;
}

export enum Purity {
  P23K958 = '23K958',
  P22K916 = '22K916',
  P20K833 = '20K833',
  P18K750 = '18K750',
  P14K585 = '14K585',
  P9K375 = '9K375',
}

export const ORNAMENT_LIST = [
  'MIX ORNAMENT',
  'RING',
  'CHAIN',
  'BANGLE',
  'EARRING',
  'NECKLACE',
  'BRACELET',
  'PENDANT',
  'NOSE PIN',
  'MANGALSUTRA',
  'ANKLET',
  'COIN',
  'BAR'
];
