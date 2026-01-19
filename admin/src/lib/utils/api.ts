import { apiClient } from '../api/client';
import type { BaseResponse } from '../api/types';
import { authStore } from '../auth/store';
import { get } from 'svelte/store';

export async function getData<T = any, M = any>(
	endPoint: string,
	summaryOnly = false,
	limit?: number,
	page?: number,
	skip?: number,
	additionalParams?: Record<string, string>
): Promise<BaseResponse<T, M>> {
	try {
		const token = get(authStore).token;
		
		// Calculate skip from page if page is provided and skip is not
		let calculatedSkip = skip;
		if (page !== undefined && skip === undefined && limit !== undefined) {
			calculatedSkip = (page - 1) * limit;
		}
		
	const queryParams = new URLSearchParams({
		summaryOnly: String(summaryOnly),
		...(limit !== undefined && { limit: String(limit) }),
		...(page !== undefined && { page: String(page) }),
		...(calculatedSkip !== undefined && { skip: String(calculatedSkip) }),
		...(additionalParams || {})
	});

		const response = await apiClient.get<BaseResponse<T, M>>(
			`/${endPoint}?${queryParams.toString()}`,
			token || undefined
		);

		if (response.success && response.data) {
			return response.data as BaseResponse<T, M>;
		}

		return { data: [], meta: {} as M, message: response.message || '' };
	} catch (error) {
		console.error('Error fetching data:', error);
		return { data: [], meta: {} as any, message: '' };
	}
}

export async function addData(endPoint: string, data: Record<string, any>): Promise<{
	success: boolean;
	message?: string;
}> {
	try {
		const token = get(authStore).token;
		if (!token) {
			return { success: false, message: 'Authentication required' };
		}

		const response = await apiClient.post(`/${endPoint}`, data, token);

		return {
			success: response.success,
			message: response.message
		};
	} catch (error: any) {
		console.error('Error adding data:', error);
		return { success: false, message: error.message || 'An error occurred' };
	}
}

export async function updateData(
	endPoint: string,
	id: string | number,
	data: Record<string, any>
): Promise<{ success: boolean; message?: string }> {
	try {
		const token = get(authStore).token;
		if (!token) {
			return { success: false, message: 'Authentication required' };
		}

		const response = await apiClient.put(`/${endPoint}/${id}`, data, token);

		return {
			success: response.success,
			message: response.message
		};
	} catch (error: any) {
		console.error('Error updating data:', error);
		return { success: false, message: error.message || 'An error occurred' };
	}
}

export async function deleteData(
	endPoint: string,
	id: string | number
): Promise<{ success: boolean; message?: string }> {
	try {
		const token = get(authStore).token;
		if (!token) {
			return { success: false, message: 'Authentication required' };
		}

		const response = await apiClient.delete(`/${endPoint}/${id}`, token);

		return {
			success: response.success,
			message: response.message
		};
	} catch (error: any) {
		console.error('Error deleting data:', error);
		return { success: false, message: error.message || 'An error occurred' };
	}
}
