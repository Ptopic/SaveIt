import useGetAllCollectionsOnScroll from '@/api/collection/hooks/useGetAllCollectionsOnScroll';
import CollectionCard from '@/components/CollectionCard';
import ScreenHeader from '@/components/ScreenHeader';
import React, { useCallback } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';

const index = () => {
	const COLLECTIONS_PAGE_SIZE = '6';

	const { width } = Dimensions.get('window');

	const cardWidth = (width - 40) / 2;

	const {
		collections,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useGetAllCollectionsOnScroll({
		pageSize: COLLECTIONS_PAGE_SIZE,
		searchQuery: '',
	});

	const handleEndReached = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className="p-4 gap-5" style={{ flex: 1 }}>
				<ScreenHeader title="Collections" />

				{isLoading ? (
					<ActivityIndicator />
				) : (
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							gap: 10,
							flexDirection: 'row',
							flexWrap: 'wrap',
							paddingBottom: hasNextPage ? 50 : 0,
						}}
						onScroll={({ nativeEvent }) => {
							const { layoutMeasurement, contentOffset, contentSize } =
								nativeEvent;
							const paddingToBottom = 50;
							const isCloseToBottom =
								layoutMeasurement.height + contentOffset.y >=
								contentSize.height - paddingToBottom;

							if (isCloseToBottom) {
								handleEndReached();
							}
						}}
						scrollEventThrottle={200}
					>
						{collections && collections.length > 0 ? (
							collections.map((collection: any) =>
								collection ? (
									<CollectionCard
										key={collection.id}
										id={collection.id}
										name={collection.name}
										image={collection.image}
										className={`w-[${cardWidth}px] h-[200px]`}
									/>
								) : null
							)
						) : (
							<View className="w-full items-center py-4">
								<Text>No collections found</Text>
							</View>
						)}

						{isFetchingNextPage && (
							<View className="w-full items-center py-4">
								<ActivityIndicator size="large" />
							</View>
						)}

						{hasNextPage && <View style={{ width: '100%', height: 100 }} />}
					</ScrollView>
				)}
			</View>
		</SafeAreaView>
	);
};

export default index;
