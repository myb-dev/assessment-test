import { useDebounce, useFetch } from "@vueuse/core";
import { filter, some } from "lodash";
import { computed, ref } from "vue-demi";

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  avatar: string;
}

export function useContacts() {
  const { isFetching, error, data } = useFetch<Contact[]>(
    "https://random-data-api.com/api/users/random_user?size=100",
    { initialData: { results: [] } }
  )
    .get()
    .json();

  const search = ref("");

  const debouncedSearch = useDebounce(search, 400);

  const filtered = computed(() => {
    if (!debouncedSearch.value) return data.value;

    return filter(data.value, item => {
      const toSearch = [item.first_name, item.last_name, item.email];
      return some(toSearch, q => q.includes(debouncedSearch.value));
    });
  });

  return {
    isFetching,
    search,
    filtered,
    error,
    contacts: data
  };
}

export function useContactById(id: number) {
  const { isFetching, error, data } = useFetch<Contact>(
    `https://random-data-api.com/api/users/random_user?id=${id}`,
    { initialData: { results: null } }
  )
    .get()
    .json();

  return {
    isFetching,
    error,
    contact: data
  };
}