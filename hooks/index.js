import useSWR from "swr";
import StringCrypto from "string-crypto";

export function useSedes(token) {
  const { data, error, mutate } = useSWR(['/sedes', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    sedes: data,
    mutate
  }
}

export function useSede(token, id) {
  const { data, error } = useSWR([id ? `/sedes/${id}` : null, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    sede: data
  }
}

export function useApplicants(token) {
  const { data, error, mutate } = useSWR(['/applicants', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    applicants: data,
    mutate
  }
}

export function useApplicant(token, id) {
  const { data, error } = useSWR([id ? `/applicants/${id}` : null, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    applicant: data
  }
}

export function useItems(token){
  const { data, error, mutate } = useSWR(['/items', token])

  return {
    isLoading: !data && !error,
    isError: error,
    items: data || [],
    mutate
  }
}

export function useItem(token, id){
  console.log("Item Id", id);
  const { data, error, mutate } = useSWR([id ? `/items/${id}?withChild=true` : null, token])
  const { data: itemStores, error: storeError } = useSWR([id ? `/stores/items/${id}` : null, token])

  return {
    isLoading: !data && !error,
    isError: error || storeError,
    item: data,
    itemStores,
    itemMutate: mutate
  }
}

export function useNotes(token, {
  createStamp,
  returnStamp,
  noteType,
  applicantType,
  applicantId,
  disabled,
  isDeleted,
  createdAt,
  startDate,
  endDate
}) {
  const query = {
    createStamp,
    returnStamp,
    noteType,
    applicantType,
    applicantId,
    disabled,
    isDeleted,
    createdAt,
    startDate,
    endDate
  };

  Object.keys(query).forEach((key) => {
    if (query[key] === undefined) {
      delete query[key];
    }
  });

  const { data, error } = useSWR( Object.keys(query).length !== 0 ? ['/delivery-notes', token, query] : ['/delivery-notes', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    notes: data || []
  }
}

export function useNotesByItem(id, token) {
  const { data, error } = useSWR([id ? `/delivery-notes/items/${id}` : null, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    itemNotes: data || []
  }
}

export function useNotesBySede(id, token) {
  const { data, error } = useSWR([id ? `/delivery-notes/sedes/${id}` : null, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    sedeNotes: data || []
  }
}

export function useStores(token) {
  const { data, error, mutate } = useSWR(['/stores', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    stores: data || [],
    mutate
  }
}

export function useStore(id, token) {
  console.log("storeId", id);
  const { data, error, mutate } = useSWR([id ? `/stores/${id}` : null, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    store: data || [],
    mutate
  }
}

export function useStoreItems(id, token){
  const { data, error, mutate } = useSWR([id ? `/stores/${id}/items` : null, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    items: data || [],
    mutate
  }
}

export function useUsers(token) {
  const { data, error, mutate } = useSWR([`/users`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    users: data || [],
    mutate
  }
}

export function useUser(id, token) {
  const { data, error } = useSWR([id ? `/users/${id}`: null, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    user: data || {}
  }
}

export function useRoles(token) {
  const { data, error } = useSWR([`/users`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    user: data || []
  }
}

export function useDecrypt(text) {
  console.log(text);
  const { NEXT_PUBLIC_PASSWORD_SECRET } = process.env;
  const { decryptString } = new StringCrypto();
  if(text) {
    return decryptString(text, NEXT_PUBLIC_PASSWORD_SECRET);
  }
  return '';
}