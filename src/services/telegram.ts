import axios from 'axios';
import { Order, OrderItem } from './supabase';

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Telegram credentials are missing. Please check your environment variables.');
}

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Format order items for Telegram notification
 */
const formatOrderItems = (items: OrderItem[]): string => {
  return items.map(item => 
    `- ${item.quantity}x ${item.product_name} (${item.weight}) - ₹${item.price.toFixed(2)}`
  ).join('\n');
};

/**
 * Send a new order notification to Telegram
 */
export const sendOrderNotification = async (order: Order): Promise<boolean> => {
  try {
    const message = `
🔔 *NEW ORDER RECEIVED* 🔔

*Order ID:* #${order.id}
*Customer:* ${order.customer_name}
*Phone:* ${order.phone_number}
*Address:* ${order.address}

*Items:*
${formatOrderItems(order.items)}

*Total Amount:* ₹${order.total_amount.toFixed(2)}

*Date:* ${new Date(order.created_at).toLocaleString()}
`;

    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

/**
 * Send order status update notification to Telegram
 */
export const sendStatusUpdateNotification = async (order: Order): Promise<boolean> => {
  try {
    const statusEmoji = {
      received: '📥',
      processing: '⚙️',
      out_for_delivery: '🚚',
      delivered: '✅'
    };

    const message = `
${statusEmoji[order.status]} *ORDER STATUS UPDATED* ${statusEmoji[order.status]}

*Order ID:* #${order.id}
*Customer:* ${order.customer_name}
*Status:* ${order.status.toUpperCase()}
*Updated at:* ${new Date().toLocaleString()}
`;

    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    return response.status === 200;
  } catch (error) {
    console.error('Error sending Telegram status update:', error);
    return false;
  }
};
