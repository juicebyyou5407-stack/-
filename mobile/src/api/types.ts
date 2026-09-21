export type Role = "ADMIN" | "STAFF";

export type Organization = {
  id: string;
  name: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Customer = {
  id: string;
  name: string;
  nameKana: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  birthDate: string | null;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { contracts: number };
};

export type ContractStatus = "ACTIVE" | "PENDING" | "CANCELLED" | "EXPIRED";

export type Contract = {
  id: string;
  customerId: string;
  productName: string;
  contractNumber: string | null;
  status: ContractStatus;
  premiumAmount: number | null;
  paymentCycle: string | null;
  startDate: string;
  renewalDate: string | null;
  cancelledAt: string | null;
  memo: string | null;
  customer?: { id: string; name: string; phone?: string | null };
};

export type Activity = {
  id: string;
  customerId: string;
  type: string;
  content: string;
  createdAt: string;
  user?: { name: string };
};

export type CustomerDetail = Customer & {
  contracts: Contract[];
  activities: Activity[];
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};
