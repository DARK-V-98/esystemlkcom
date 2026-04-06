import OrderDetailsClient from './order-details-client';

export const metadata = {
  title: 'Manage Project | ESystemLk Admin',
  description: 'Update project progress, stages, and client access.',
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return <OrderDetailsClient id={params.id} />;
}
