import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import useFetch from '@/hooks/useFetch'
import { fetchMovies } from '@/services/api'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userTyping, setUserTyping] = useState(false);

  const { 
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    setUserTyping(true);

    const timeoutId = setTimeout(async () => {
      setUserTyping(false);
      if (!searchQuery?.trim()) {
        reset();
        return;
      };
  
      await loadMovies();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.length > 0 && movies?.[0]) {
      updateSearchCount(searchQuery, movies?.[0]);
    }
  }, [movies])
  

  return (
    <View
      className='flex-1 bg-primary'
    >
      <Image
        source={images.bg}
        className='flex-1 absolute w-full z-0'
        resizeMode='cover'
      />
      
      <FlatList
        data={movies}
        renderItem={({item}) => <MovieCard {...item} />}
        keyExtractor={item => item?.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100}}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-16 items-center'>
              <Image
                source={icons.logo}
                className='w-12 h-10'
              />
            </View>

            <View className='my-5'>
              <SearchBar
                placeholder='Search movies ...'
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            {moviesLoading && (
              <ActivityIndicator
                size='large'
                color='#0000ff'
                className='my-3'
              />
            )}

            {moviesError && (
              <Text className='text-red-500 px-5 my-3'>
                Error: {moviesError?.message}
              </Text>
            )}

            {!moviesLoading && !moviesError && searchQuery?.trim() && !!movies?.length && (
              <Text className='text-sl text-white font-bold'>
                Search Results for&nbsp;
                <Text className='text-accent'>{searchQuery}</Text>
              </Text>            
            )}
          </>
        }
        ListEmptyComponent={
          <>
            {!moviesLoading && !moviesError && (
              <View className='mt-10 px-5'>
                <Text 
                  className='text-center text-gray-500'>
                  {searchQuery?.trim() && !userTyping ? 'No movies found' : 'Search for a movie ... '}
                </Text>
              </View>
            )}
          </>
        }
      />
    </View>
  )
}

export default Search