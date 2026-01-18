import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DEFAULT_STALE_TIME } from "@core/utils/constants";

export async function getUser() {
    const res = await api.user.$get();
    if (!res.ok) {
        throw new Error(`Failed to get user: ${res.status} ${res.statusText}`);
    }
    return await res.json();
}
export const userQueryOptions = queryOptions({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: DEFAULT_STALE_TIME,
});
