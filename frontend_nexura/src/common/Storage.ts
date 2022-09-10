export const saveValue = (key: string, objValue: object) => {
  const rest = getValue(key);
  const obj = JSON.stringify({ ...rest, ...objValue });

  if (typeof window !== "undefined") {
    localStorage.setItem(key, obj);
  }
};

export const getValue = (key: string): any => {
  let data: any = {};

  if (typeof window !== "undefined") {
    const result = localStorage.getItem(key);
    data = result ? JSON.parse(result) : null;
  }

  return data;
};

export const wipeValue = () => localStorage.clear();
