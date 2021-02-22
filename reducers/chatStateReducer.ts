import { createReducer, ActionTypes } from 'reduxsauce';
import { REHYDRATE } from 'redux-persist';
import { reject, find, cloneDeep, get } from 'lodash';

import { Agent, Message } from '../../model/model';
import { ChatStateTypes } from './chatStateActions';

export interface ChatStateReducerType {
	loading: boolean;
	chatId?: string;
	surveyUrl?: string;
	active: boolean;
	secondsToWait: number;
	agents: Agent[];
	messages: Message[];
	online: boolean;
	finished: boolean;
	counter: number;
	typing: string;
	video: boolean;
	retries: number;
	pendingMessages: string[];
}

export const defaultState: ChatStateReducerType = {
	loading: false,
	chatId: undefined,
	surveyUrl: undefined,
	active: false,
	secondsToWait: 360,
	agents: [],
	messages: [],
	online: true,
	finished: false,
	counter: 0,
	typing: '',
	video: false,
	retries: 0,
	pendingMessages: [],
};

interface ChatStateAddMessageReducerActionType {
	type: ActionTypes;
	messages: Message[];
}

export const addChatMessages = (
	state: ChatStateReducerType,
	action: ChatStateAddMessageReducerActionType,
): ChatStateReducerType => {
	return { ...state, messages: state.messages.concat(action.messages) };
};

interface ChatStateSetAgentReducerActionType {
	type: ActionTypes;
	agent: Agent;
}

export const addChatAgent = (
	state: ChatStateReducerType,
	action: ChatStateSetAgentReducerActionType,
): ChatStateReducerType => {
	return { ...state, agents: state.agents.concat([action.agent]) };
};

interface ChatStateSetIdReducerActionType {
	type: ActionTypes;
	chatId: string;
	surveyUrl?: string;
}

export const setChatSessionId = (
	state: ChatStateReducerType,
	action: ChatStateSetIdReducerActionType,
): ChatStateReducerType => {
	return { ...state, chatId: action.chatId, surveyUrl: action.surveyUrl };
};

interface UpdateChatIdActionType {
	type: ActionTypes;
	chatId: string;
}

export const updateChatId = (
	state: ChatStateReducerType,
	action: UpdateChatIdActionType,
): ChatStateReducerType => {
	return { ...state, chatId: action.chatId };
};

interface ChatStateSetSecondsToWaitReducerActionType {
	type: ActionTypes;
	secondsToWait: number;
}

export const setSecondsToWait = (
	state: ChatStateReducerType,
	action: ChatStateSetSecondsToWaitReducerActionType,
): ChatStateReducerType => {
	return { ...state, secondsToWait: action.secondsToWait };
};

export const setActive = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return { ...state, active: true };
};

export const setInactive = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return { ...state, active: false };
};

export const setVideo = (state: ChatStateReducerType): ChatStateReducerType => {
	return { ...state, video: true };
};

interface RootStateAction {
	payload?: {
		chatState: ChatStateReducerType;
	};
}
export const rehydrateReducer = (
	state: ChatStateReducerType,
	action: RootStateAction,
): ChatStateReducerType => {
	return {
		...state,
		...get(action, 'payload.chatState', {}),
		active: false,
		loading: false,
	};
};

export interface RemoveMessageActionType {
	type: ActionTypes;
	id: string;
}

export const removeChatMessage = (
	state: ChatStateReducerType,
	action: RemoveMessageActionType,
): ChatStateReducerType => {
	const messages = reject(state.messages, { id: action.id });
	return {
		...state,
		messages,
	};
};

export interface UpdateMessageActionType {
	type: ActionTypes;
	id: string;
	url: string;
}

export const updateChatMessage = (
	state: ChatStateReducerType,
	action: UpdateMessageActionType,
): ChatStateReducerType => {
	const messages = cloneDeep(state.messages);
	const mes = find(messages, { id: action.id });
	if (mes && mes.attachment) {
		mes.attachment = action.url;
	}
	return {
		...state,
		messages,
	};
};

export const setChatStatusOffline = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return {
		...state,
		online: false,
	};
};

export const setChatStatusOnline = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return {
		...state,
		online: true,
	};
};

export const setChatStatusFinished = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return {
		...state,
		finished: true,
	};
};

export const setChatStatusNotFinished = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return {
		...state,
		finished: false,
	};
};

export interface UpdateCounterActionType {
	type: ActionTypes;
	count: number;
}

export const incrementCounter = (
	state: ChatStateReducerType,
	action: UpdateCounterActionType,
): ChatStateReducerType => {
	return {
		...state,
		counter: action.count + state.counter,
	};
};

export const clearCounter = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return {
		...state,
		counter: 0,
	};
};

export const clearChatState = (): ChatStateReducerType => {
	return { ...defaultState };
};

export interface SetAgentTypingActionType {
	agentId: string;
}

export const setAgentTyping = (
	state: ChatStateReducerType,
	action: SetAgentTypingActionType,
): ChatStateReducerType => {
	return {
		...state,
		typing: action.agentId,
	};
};

export const setAgentListening = (
	state: ChatStateReducerType,
): ChatStateReducerType => {
	return {
		...state,
		typing: '',
	};
};

export interface SetRetryCounterActionType {
	retries: number;
}

export const setRetryCounter = (
	state: ChatStateReducerType,
	action: SetRetryCounterActionType,
): ChatStateReducerType => {
	return {
		...state,
		retries: action.retries,
	};
};

interface PendingMessageActionType {
	message: string;
}

export const addPendingMessage = (
	state: ChatStateReducerType,
	action: PendingMessageActionType,
): ChatStateReducerType => {
	return {
		...state,
		pendingMessages: [...state.pendingMessages, action.message],
	};
};

export const clearPendingMessages = (state: ChatStateReducerType) => {
	return { ...state, pendingMessages: [] };
};

export const chatStateReducer = createReducer(defaultState, {
	[REHYDRATE]: rehydrateReducer,
	[ChatStateTypes.SET_ACTIVE]: setActive,
	[ChatStateTypes.SET_INACTIVE]: setInactive,
	[ChatStateTypes.SET_CHAT_SESSION_ID]: setChatSessionId,
	[ChatStateTypes.UPDATE_CHAT_ID]: updateChatId,
	[ChatStateTypes.CLEAR_CHAT_STATE]: clearChatState,
	[ChatStateTypes.SET_SECONDS_TO_WAIT]: setSecondsToWait,
	[ChatStateTypes.ADD_CHAT_AGENT]: addChatAgent,
	[ChatStateTypes.ADD_CHAT_MESSAGES]: addChatMessages,
	[ChatStateTypes.REMOVE_CHAT_MESSAGE]: removeChatMessage,
	[ChatStateTypes.UPDATE_CHAT_MESSAGE]: updateChatMessage,
	[ChatStateTypes.SET_CHAT_STATUS_ONLINE]: setChatStatusOnline,
	[ChatStateTypes.SET_CHAT_STATUS_OFFLINE]: setChatStatusOffline,
	[ChatStateTypes.SET_CHAT_STATUS_FINISHED]: setChatStatusFinished,
	[ChatStateTypes.INCREMENT_COUNTER]: incrementCounter,
	[ChatStateTypes.CLEAR_COUNTER]: clearCounter,
	[ChatStateTypes.SET_AGENT_TYPING]: setAgentTyping,
	[ChatStateTypes.SET_AGENT_LISTENING]: setAgentListening,
	[ChatStateTypes.SET_VIDEO]: setVideo,
	[ChatStateTypes.SET_RETRY_COUNTER]: setRetryCounter,
	[ChatStateTypes.ADD_PENDING_MESSAGE]: addPendingMessage,
	[ChatStateTypes.CLEAR_PENDING_MESSAGES]: clearPendingMessages,
});
