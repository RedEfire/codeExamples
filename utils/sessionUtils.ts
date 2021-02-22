export const SESSION_FLAG = 'chat_flag';

export const constractFlagName = (id: number | string) =>
  `${SESSION_FLAG}_${id}`;

export const setChatFlag = (id: number | string, uniqueId: string) => {
  const data = getChatData(id);
  if (!data) {
    localStorage.setItem(constractFlagName(id), uniqueId);
  }
};

export const getChatData = (id: number | string) =>
  localStorage.getItem(constractFlagName(id));

export const removeChatFlag = (id: number | string) =>
  localStorage.removeItem(constractFlagName(id));

export const isMainChat = (id: number | string, uniqueId: string): boolean => {
  const data = getChatData(id);
  let result = false;
  if ((data && data.includes(uniqueId)) || isNoChat(id)) {
    setChatFlag(id, uniqueId);
    result = true;
  }
  return result;
};

export const isNoChat = (id: number | string): boolean =>
  !getChatData(id);
