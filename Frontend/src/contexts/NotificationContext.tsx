import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import * as signalR from '@microsoft/signalr';
import { getNotifications, markAsRead as markAsReadApi, markAllAsRead as markAllAsReadApi } from '../services/notificationApi';
import { useAuth } from './AuthContext';
import type { Notification } from '../types';
import { baseURL } from '../services/http';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchNotifications();

      const hubUrl = baseURL.replace('/api', '') + '/hubs/notifications';
      const token = localStorage.getItem('token');

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token || '',
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .configureLogging(signalR.LogLevel.None)
        .withAutomaticReconnect()
        .build();

      let isCancelled = false;

      newConnection.on('ReceiveNotification', (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        
        // Browser notification if possible
        if (Notification.permission === 'granted') {
          new Notification('InteractHub', {
            body: notification.content,
            icon: '/favicon.ico'
          });
        }
      });

      const startConnection = async () => {
        try {
          await newConnection.start();
          if (!isCancelled) {
            console.log('SignalR Connected');
          }
        } catch (err) {
          if (!isCancelled) {
            const message = err instanceof Error ? err.message : String(err);
            if (!message.includes('Failed to start the HttpConnection before stop() was called.')) {
              console.error('SignalR Connection Error: ', err);
            }
          }
        }
      };

      void startConnection();

      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      return () => {
        isCancelled = true;
        void newConnection.stop().catch(() => {});
      };
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      await markAsReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  };

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  }), [notifications, unreadCount, loading, fetchNotifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
