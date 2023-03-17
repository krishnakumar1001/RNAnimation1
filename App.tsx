import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';

const {height, width} = Dimensions.get('screen');
const App = () => {
  const [data, setData] = useState([]);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const ref = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(
        'https://api.themoviedb.org/3/movie/popular?api_key=afc5f8fe85b8803c153f601fda8cb046',
      )
      .then(res => {
        console.log('res----->', res.data.results);
        setData(res.data.results);
      })
      .catch(err => console.log(err));
  }, []);

  const onViewableItemsChanged = ({viewableItems, changed}: any) => {
    if (changed[0].isViewable) {
      const viewableIndex = viewableItems[0].index;
      console.log(viewableIndex);

      setCurrentIndex(viewableIndex);
    }
  };

  const viewabilityConfig = {
    waitForInteraction: true,
    itemVisiblePercentThreshold: 85,
  };
  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

  const renderMovies = ({item, index}: any) => {
    return (
      <Animated.View
        style={{
          ...styles.renderView,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [230 * (index - 1), 230 * index, 230 * (index + 1)],
                outputRange: [0, -80, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <Image
          style={styles.renderImage}
          source={{
            uri: `https://image.tmdb.org/t/p/w780${item?.poster_path}`,
          }}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      <ImageBackground
        style={{flex: 1, height: height, width: width}}
        blurRadius={16}
        source={{
          uri: `https://image.tmdb.org/t/p/w780${data[currentIndex]?.poster_path}`,
        }}>
        <Animated.FlatList
          data={data}
          ref={ref}
          horizontal
          renderItem={renderMovies}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          keyExtractor={(item: any, index: any) => index.toString()}
          onScrollEndDrag={() =>
            ref.current.scrollToIndex({
              index: currentIndex,
              animated: true,
            })
          }
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: animatedValue,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        <View style={styles.detailView}>
          <Text numberOfLines={1} style={styles.titleText}>
            {data[currentIndex]?.title}
          </Text>
          <Text numberOfLines={7} style={styles.detailText}>
            {data[currentIndex]?.overview}
          </Text>
        </View>
        <View style={styles.numberDetail}>
          <View style={styles.ratingView}>
            <Image
              style={styles.starIcon}
              source={require('./src/assets/icons/star.png')}
            />
            <Text style={styles.numText}>
              {data[currentIndex]?.vote_average}
            </Text>
          </View>
          <Text style={styles.numText}>{data[currentIndex]?.release_date}</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  flatList: {
    marginTop: 100,
    marginLeft: 80,
    paddingRight: 150,
  },
  renderView: {
    width: 230,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderImage: {
    backgroundColor: 'powderblue',
    height: 300,
    width: 200,
  },
  detailView: {
    alignSelf: 'center',
    height: 200,
    width: '80%',
  },
  titleText: {
    textAlign: 'center',
    color: 'white',

    fontSize: 24,
    fontWeight: '600',
  },
  detailText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  numberDetail: {
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  ratingView: {
    flexDirection: 'row',
  },
  starIcon: {
    height: 20,
    width: 20,
  },
  numText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
export default App;
