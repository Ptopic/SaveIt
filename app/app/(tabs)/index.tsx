import useGetUserInfo from '@/api/auth/hooks/useGetUserInfo';
import useGetAllImportsOnScroll from '@/api/imports/hooks/useGetAllImportsOnScroll';
import Search from '@/components/Search';
import Subtitle from '@/components/Subtitle';
import Text from '@/components/Text';
import Title from '@/components/Title';
import FiltersToolbar from '@/feature/home/FiltersToolbar';
import ImportCard from '@/feature/home/ImportCard';
import useDebounce from '@/hooks/useDebounce';
import { config } from '@/shared/config';
import { BookmarkIcon, SearchIcon } from '@/shared/svgs';
import { getDeviceWidth } from '@/utils/device';
import { getTailwindHexColor } from '@/utils/getTailwindColor';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	View,
} from 'react-native';
import io from 'socket.io-client';

const socket = io(config.apiUrl);

export default function TabOneScreen() {
	const IMPORTS_PAGE_SIZE = '6';

	const width = getDeviceWidth();

	const cardWidth = (width - 40) / 2;

	const { data: user } = useGetUserInfo();

	const [refreshing, setRefreshing] = useState(false);

	const [activeFilter, setActiveFilter] = useState<string>('');

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const debouncedSearchValue = useDebounce(searchValue, 600);

	const {
		imports,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch: refetchImports,
	} = useGetAllImportsOnScroll({
		pageSize: IMPORTS_PAGE_SIZE,
		searchQuery: debouncedSearchValue,
		type: activeFilter,
	});

	const handleEndReached = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	useEffect(() => {
		socket.on(`refetchImports-${user?.id}`, () => {
			refetchImports();
		});
	}, [user]);

	const onRefresh = async () => {
		setRefreshing(true);
		refetchImports();
		setRefreshing(false);
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-col p-[15] gap-4">
				<View className="flex-row justify-between items-center">
					{!isSearchOpen ? (
						<>
							<View className="flex-row items-center gap-2">
								<BookmarkIcon
									height={24}
									width={24}
									color={getTailwindHexColor('black')}
									fill={getTailwindHexColor('black')}
								/>
								<Title>Saveit</Title>
							</View>
							<TouchableOpacity onPress={() => setIsSearchOpen(true)}>
								<SearchIcon height={24} width={24} color="black" />
							</TouchableOpacity>
						</>
					) : (
						<Search
							value={searchValue}
							onChangeText={(text) => setSearchValue(text)}
							onClear={() => setIsSearchOpen(false)}
							placeholder="Search"
							clearAlwaysVisible
						/>
					)}
				</View>

				<View className="flex-col gap-4">
					<View className="flex-row gap-4">
						<TouchableOpacity>
							<Subtitle>Imports</Subtitle>
						</TouchableOpacity>

						<TouchableOpacity>
							<Subtitle>Locations</Subtitle>
						</TouchableOpacity>
					</View>

					<View className="flex-row gap-4">
						<FiltersToolbar
							activeFilter={activeFilter}
							setActiveFilter={setActiveFilter}
						/>
					</View>

					{isLoading ? (
						<ActivityIndicator />
					) : (
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{
								gap: 10,
								flexDirection: 'row',
								flexWrap: 'wrap',
								paddingBottom: 280,
							}}
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={onRefresh}
									colors={['black']}
								/>
							}
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
						>
							{imports && imports.length > 0 ? (
								imports.map((importItem: any) =>
									importItem ? (
										<ImportCard
											key={importItem.id}
											importItem={importItem}
											cardWidth={cardWidth}
										/>
									) : null
								)
							) : (
								<View className="w-full items-center py-4">
									<Text>No imports found</Text>
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
			</View>
		</SafeAreaView>
	);
}
