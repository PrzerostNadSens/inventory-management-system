export class CreateOrderRequestDto {
  public customerId: string;
  public products: { id: string; quantity: number }[];
}
