export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
};

const products: Product[] = [
  { id: 'p-001', name: 'Wireless Headphones', price: 25000, description: 'Comfortable headphones with clear sound.', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', category: 'Electronics', stock: 20 },
  { id: 'p-002', name: 'Smart Watch', price: 42000, description: 'Track activity, calls, and notifications.', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', category: 'Electronics', stock: 15 },
  { id: 'p-003', name: 'Leather Backpack', price: 35000, description: 'Durable everyday bag for work and travel.', imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', category: 'Fashion', stock: 12 },
  { id: 'p-004', name: 'Running Sneakers', price: 38000, description: 'Lightweight sneakers for daily movement.', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', category: 'Fashion', stock: 30 },
  { id: 'p-005', name: 'Desk Lamp', price: 15000, description: 'Modern LED lamp for focused work.', imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', category: 'Home', stock: 18 },
  { id: 'p-006', name: 'Ceramic Mug Set', price: 12000, description: 'Minimal mug set for home and office.', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d', category: 'Home', stock: 25 }
];

export const productService = {
  list: (query?: string, category?: string) => products.filter((product) => {
    const matchesQuery = query ? product.name.toLowerCase().includes(query.toLowerCase()) : true;
    const matchesCategory = category ? product.category.toLowerCase() === category.toLowerCase() : true;
    return matchesQuery && matchesCategory;
  }),
  findById: (id: string) => products.find((product) => product.id === id)
};
