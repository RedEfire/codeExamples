import axios, {
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError,
	AxiosPromise,
} from 'axios';
import { get } from 'lodash';
import { getCookie } from '../../utils/cookies';

export const TICKET = 'ticket';
export const AUTH_COOKIE = 'Auth-Cookie';
export const TOKEN = 'token';
export const AUTHORIZATION = 'Authorization';
export const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export enum MethodType {
	POST = 'POST',
	GET = 'GET',
	PUT = 'PUT',
	DELETE = 'DELETE',
}

export interface Result {
	data?: any;
	error?: AxiosError;
}

interface Headers {
	[key: string]: string;
}

export const getHeaders = (): Headers => ({
	'Content-Type': 'application/json',
});

export const getAuthHeaders = (): Headers => {
	const header: Headers = {};
	const token = getCookie(TOKEN);
	const ticketHeaderValue = getCookie(TICKET);
	if (token) {
		header[AUTHORIZATION] = token;
	}
	if (ticketHeaderValue) {
		header[AUTH_COOKIE] = ticketHeaderValue;
	}
	return header;
};

export const getAxios = (
	path: string,
	method: MethodType,
	body?: unknown,
	headers = {},
): AxiosPromise<any> => {
	const opts: AxiosRequestConfig = {
		url: `${BASE_URL}${path}`,
		headers: { ...getHeaders(), ...getAuthHeaders(), ...headers },
		method,
	};
	if (body && (method === MethodType.POST || method === MethodType.PUT)) {
		if (body instanceof FormData) {
			opts.data = body;
		} else {
			opts.data = JSON.stringify(body);
		}
	}
	return axios(opts);
};

export function isResponseOK(response: AxiosResponse): boolean {
	const data = get(response, 'data', null);
	return !!data;
}

export function requestApi(
	path = '',
	method: MethodType,
	body?: unknown,
	headers = {},
): Promise<unknown> {
	const result: Result = { data: null, error: undefined };
	return getAxios(path, method, body, headers)
		.then((res) => {
			if (isResponseOK(res)) {
				result.data = get(res, 'data', {});
			}
		})
		.catch((err: AxiosError) => {
			result.error = err;
		})
		.then(() => Promise.resolve(result));
}

export function requestFakeApi(fakeData: unknown): Promise<unknown> {
	return new Promise((resolve) => {
		setTimeout(() => resolve({ data: fakeData, error: null }), 1000);
	});
}

export const getFileUrl = async (src: string): Promise<Blob | null> => {
	let blob = null;
	try {
		const options = { headers: getAuthHeaders() };
		const response = await fetch(src, options);
		if (response.ok) {
			blob = await response.blob();
		}
	} catch (error) {
		console.error('Error while loading attachment', error);
	}
	return blob;
};
