// blueprint for what fields Item object should possess
export interface Item {
  id: string;
  name: string;
  count: number;
  expiration_date?: string;
}