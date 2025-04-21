import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../services/supabase';
import { updateOrderStatus } from '../../services/supabase';
import { sendStatusUpdateNotification } from '../../services/telegram';
import Button from '../ui/Button';

interface OrdersTableProps {
  orders: Order[];
  onOrderUpdated: () => void;
}

const OrdersTable = ({ orders, onOrderUpdated }: OrdersTableProps) => {
  const navigate = useNavigate();
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
    try {
      setUpdatingOrderId(orderId);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      await sendStatusUpdateNotification(updatedOrder);
      onOrderUpdated();
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders based on status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone_number.includes(searchTerm) ||
      order.id.toString().includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === 'received'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            onClick={() => setFilter('received')}
          >
            Received
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === 'processing'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === 'out_for_delivery'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
            onClick={() => setFilter('out_for_delivery')}
          >
            Out for Delivery
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              filter === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, phone or order ID"
            className="input pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {searchTerm ? (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </span>
        </div>
      </div>

      {/* Orders Count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{order.total_amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{order.items.length} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        View
                      </Button>
                      
                      {order.status !== 'delivered' && (
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusUpdate(order.id, e.target.value as typeof order.status);
                              e.target.value = '';
                            }
                          }}
                          disabled={updatingOrderId === order.id}
                        >
                          <option value="">Update Status</option>
                          {order.status !== 'received' && <option value="received">Received</option>}
                          {order.status !== 'processing' && <option value="processing">Processing</option>}
                          {order.status !== 'out_for_delivery' && <option value="out_for_delivery">Out for Delivery</option>}
                          {(order.status === 'received' || order.status === 'processing' || order.status === 'out_for_delivery') && 
                            <option value="delivered">Delivered</option>}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
