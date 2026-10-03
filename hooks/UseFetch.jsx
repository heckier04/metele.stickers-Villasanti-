import { useEffect, useState } from "react";

const useFetch = (url, initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;

        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                if (err.name !== "AbortError") setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;