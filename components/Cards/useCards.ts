import { useEffect, useState } from 'react'
import { axiosInstance, getAccessToken } from '@/utils/networking'
import { Card, CardStatus } from './types';

const API_ISSUING = process.env.EXPO_PUBLIC_API_ISSUING
const API_KEY = process.env.EXPO_PUBLIC_API_KEY


export default function useGetCards(entityId: string, filters: { status?: CardStatus; last4?: string }) {
	const [cards, setCards] = useState<ICards>({
	  cards: [],
	  totalCount: 0,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>();
  
	const getCards = async () => {
	  setLoading(true);
	  try {
		const token = await getAccessToken();
		const url = `${API_ISSUING}/cards`;
		const headers = {
		  "X-User-Bearer": `Bearer ${token}`,
		};
  
		const params: any = {
		  paymentMethodReference: entityId,
		  ...(filters.status && { status: filters.status }),
		  ...(filters.last4 && { last4: filters.last4 }),
		};
		console.log("params:");
		console.log(params);
		console.log({"filters":filters});
		// console.log({"x valor:":x});
		console.log(filters.status);

		const cardsRequest = await axiosInstance({
		  method: "GET",
		  url,
		  headers,
		  params,
		});
		console.log(cardsRequest.data);
		setCards(cardsRequest.data);
	  } catch (err: any) {
		setError(err);
	  } finally {
		setLoading(false);
	  }
	};
  
	useEffect(() => {
		console.log("useEffect exec:");
	  getCards();
	},  [entityId, filters]);

	return {
	  cards,
	  loading,
	  error,
	  getCards,
	};
  }