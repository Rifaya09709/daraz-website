import api from "./api";

export interface CardPaymentData {
  orderId?: string;
  amount: number;
  cardNumber: string;
  cardName: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  saveCard: boolean;
}

export const payWithCard = async (data: CardPaymentData) => {
  const response = await api.post("/payment/card", data);
  return response.data;
};