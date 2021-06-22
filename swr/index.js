import useSWR from "swr";

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
    items: data
  }
}

export function useItem(token, id, withChild){
  const { data, error } = useSWR([`/items/${id}`, token])
  const { data: itemStores, error: storeError } = useSWR([`/stores/items/${id}?withChild=${withChild}`, token])

  return {
    isLoading: !data && !error,
    isError: error || storeError,
    item: data,
    itemStores
  }
}

export function useNotes(token) {
  const { data, error } = useSWR(['/notes', token]);

  return {
    isLoading: !data && !error,
    isError: error,
    notes: data || []
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