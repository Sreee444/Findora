import React from 'react';
import { useParams } from 'react-router-dom';
import ItemDetails from '../components/LostAndFound/ItemDetails';

export default function ItemDetailsPage() {
  const { id } = useParams();
  
  return <ItemDetails itemId={id} />;
}
