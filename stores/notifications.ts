import { defineStore } from 'pinia';

export type NotificationType = 'order' | 'customer' | 'stock_warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  createdAt: string;
  read: boolean;
  meta?: Record<string, any>;
}

const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter(n => !n.read).length,
  },

  actions: {
    addNotification(payload: Omit<Partial<Notification>, 'id' | 'createdAt'> & { type: NotificationType; title: string }) {
      const note: Notification = {
        id: genId(),
        type: payload.type,
        title: payload.title,
        message: payload.message || '',
        createdAt: new Date().toISOString(),
        read: !!payload.read,
        meta: payload.meta || {},
      };

      // push to start so newest appear first
      this.notifications.unshift(note);
      return note;
    },

    markAsRead(id: string) {
      const idx = this.notifications.findIndex(n => n.id === id);
      if (idx !== -1) this.notifications[idx].read = true;
    },

    markAllAsRead() {
      this.notifications.forEach(n => (n.read = true));
    },

    clearAll() {
      this.notifications = [];
    },
  },
});

// --- Mock data for development / testing ---
export function seedNotifications(store?: ReturnType<typeof useNotificationsStore>) {
  const target = store || useNotificationsStore();
  target.notifications = [
    {
      id: genId(),
      type: 'order',
      title: 'Nuevo pedido #1024',
      message: 'Pedido recibido: 3x Monstera Deliciosa',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
      meta: { orderId: 1024 },
    },
    {
      id: genId(),
      type: 'stock_warning',
      title: 'Stock bajo: Sustrato 20L',
      message: 'Quedan 2 unidades en inventario',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      read: false,
      meta: { productId: 'sustrato-20l' },
    },
  ];
}
