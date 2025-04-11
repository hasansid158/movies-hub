import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    fetchFunction()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err : new Error('Error occurred while fetching')))
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;