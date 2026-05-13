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
