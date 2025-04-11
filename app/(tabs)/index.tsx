import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { View, Image, ScrollView, ActivityIndicator, Text, FlatList } from 'react-native';
import SearchBar from '@/components/SearchBar';

import { useRouter } from 'expo-router';
import useFetch from '@/hooks/useFetch';
import { fetchMovies } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import { getTrendingMovies } from '@/services/appwrite';
import TrendingCard from '@/components/TrendingCard';

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const { 
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: '' }));

  return (
    <View className='flex-1 bg-primary'>
      <Image 
        source={images.bg} 
        className='absolute w-full z-0'
      />
      <ScrollView 
        className='flex-1 px-5' 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: '100%',
          paddingBottom: 10,
        }}
      >
        <Image
          source={icons.logo}
          className='w-12 h-10 mt-16 mb-5 mx-auto'
        />

        {moviesLoading || trendingLoading ? (
            <ActivityIndicator
              size='large'
              color='#0000ff'
              className='mt-10 self-center'
            />
          ) : moviesError || trendingError ? (
            <Text>Error: {moviesError?.message || trendingError?.message}</Text>
          ) : (
            <View className='flex-1'>
              <SearchBar
                onPress={() => router.push('/Search')}
                placeholder='Search for a movie'
              />

              {trendingMovies && (
                <View className='mt-10'>
                  <Text
                    className='text-lg text-white font-bold mb-3'
                  >
                    Trending Movies
                  </Text>

                  <FlatList
                    data={trendingMovies}
                    horizontal
                    renderItem={({ item, index }) => (
                      <TrendingCard movie={item} index={index}/>
                    )}
                    keyExtractor={(item => item?.movie_id?.toString())}
                    className='mb-4 mt-3'
                    showsHorizontalScrollIndicator={false}
                  />

                </View>
              )}

              <>
                <Text className='text-lg text-white font-bold mt-5 mb-3'>Latest Movies</Text>
              
                <FlatList
                  data={movies}
                  keyExtractor={item => item?.id}
                  renderItem={({ item }) => (
                    <MovieCard {...item}/>
                  )}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  className='mt-2 pb-32'
                  scrollEnabled={false}
                />
              </>
            </View>
          )
        }


      </ScrollView>
    </View>
  );
}
