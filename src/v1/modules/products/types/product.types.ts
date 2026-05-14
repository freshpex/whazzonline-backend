export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
};

export type ProductCreateInput = Omit<Product, 'id'>;

export type ProductReview = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: string;
};

export type PaginatedProducts = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
