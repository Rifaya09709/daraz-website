import api from "./api";

export interface ProductQuestion {
  _id: string;
  product: string;
  user: { _id: string; name: string };
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface QuestionsResponse {
  success: boolean;
  questions: ProductQuestion[];
  total: number;
  page: number;
  pages: number;
}

export const getProductQuestions = async (productId: string, page = 1) => {
  const response = await api.get<QuestionsResponse>(
    `/questions/product/${productId}`,
    { params: { page, limit: 10 } }
  );
  return response.data;
};

export const askQuestion = async (productId: string, question: string) => {
  const response = await api.post("/questions", { productId, question });
  return response.data;
};