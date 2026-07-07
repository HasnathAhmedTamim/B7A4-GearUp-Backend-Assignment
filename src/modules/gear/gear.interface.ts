export interface IGear {
  title: string;
  description: string;
  brand: string;
  image: string;

  pricePerDay: string;

  stock: number;

  availability?: boolean;

  categoryId: string;
}
