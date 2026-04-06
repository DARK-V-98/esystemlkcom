import OrdersClient from './orders-client';

export const metadata = {
  title: 'Order Management | ESystemLk Admin',
  description: 'Manage active projects and track development progress.',
};

export default function AdminOrdersPage() {
  return <OrdersClient />;
}
