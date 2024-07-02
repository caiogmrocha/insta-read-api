export interface WebSocketProvider {
  /**
   * Emit an event to all connected clients
   *
   * @param event
   * @param data
   */
  emit(event: string, data: any): void;

  /**
   * Emit an event to a specific user
   *
   * @param event
   * @param userId
   * @param data
   * @returns
   */
  emit(event: string, userId: number, data: any): void;
}

export const WebSocketProvider = Symbol('WebSocketProvider');
