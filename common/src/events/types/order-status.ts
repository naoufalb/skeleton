export enum OrderStatus {
  // When the order has been created, but the
  // tnfo it is trying to order has not been reserved
  Created = 'created',

  // The tnfo the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order.
  // The order expires before payment
  Cancelled = 'cancelled',

  // The order has successfully reserved the tnfo
  AwaitingPayment = 'awaiting:payment',

  // The order has reserved the tnfo and the user has
  // provided payment successfully
  Complete = 'complete',
}
