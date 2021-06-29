import useSWR from "swr";
import Cryptr from "cryptr";

export function useSedes(token) {
  const { data, error } = useSWR(['/sedes', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    sedes: data
  }
}

export function useSede(token, id) {
  const { data, error } = useSWR([`/sedes/${id}`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    sede: data
  }
}

export function useApplicants(token) {
  const { data, error } = useSWR(['/applicants', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    applicants: data
  }
}

export function useApplicant(token, id) {
  const { data, error } = useSWR([`/applicants/${id}`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    applicant: data
  }
}

export function useItems(token){
  const { data, error } = useSWR(['/items', token])

  return {
    isLoading: !data && !error,
    isError: error,
    items: data || []
  }
}

export function useItem(token, id){
  const { data, error } = useSWR([`/items/${id}?withChild=true`, token])
  const { data: itemStores, error: storeError } = useSWR([`/stores/items/${id}`, token])

  return {
    isLoading: !data && !error,
    isError: error || storeError,
    item: data,
    itemStores
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
  const { data, error } = useSWR([`/delivery-notes/items/${id}`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    itemNotes: data || []
  }
}

export function useNotesBySede(id, token) {
  const { data, error } = useSWR([`/delivery-notes/sedes/${id}`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    sedeNotes: data || []
  }
}

export function useStores(token) {
  const { data, error } = useSWR(['/stores', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    stores: data || []
  }
}

export function useStore(id, token) {
  const { data, error } = useSWR([`/stores/${id}`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    store: data || []
  }
}

export function useStoreItems(id, token){
  const { data, error } = useSWR([`/stores/${id}/items`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    items: data || []
  }
}

export function useUser(id, token) {
  const { data, error } = useSWR([`/users/${id}`, token]);

  return {
    isLoading: !data && !error,
    isError: error,
    user: data || {}
  }
}

export function useDecrypt(text) {
  const { NEXT_PUBLIC_PASSWORD_SECRET } = process.env;
  const cryptr = new Cryptr(NEXT_PUBLIC_PASSWORD_SECRET);

  return cryptr.decrypt(text);
}