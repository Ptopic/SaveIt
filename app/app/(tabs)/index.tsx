import Search from '@/components/Search';
import Subtitle from '@/components/Subtitle';
import Title from '@/components/Title';
import FiltersToolbar from '@/feature/home/FiltersToolbar';
import { SearchIcon } from '@/shared/svgs';
import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

export default function TabOneScreen() {
	const [activeFilter, setActiveFilter] = useState<string>('');

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const handleSearch = (value: string) => {
		setSearchValue(value);
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-col p-[15] gap-4">
				<View className="flex-row justify-between items-center">
					{!isSearchOpen ? (
						<>
							<Title>Saveit</Title>
							<TouchableOpacity onPress={() => setIsSearchOpen(true)}>
								<SearchIcon height={24} width={24} color="black" />
							</TouchableOpacity>
						</>
					) : (
						<Search
							value={searchValue}
							onChangeText={handleSearch}
							onClear={() => setIsSearchOpen(false)}
							placeholder="Search"
							clearAlwaysVisible
						/>
					)}
				</View>

				<View className="flex-col gap-2">
					<View className="flex-row gap-4">
						<TouchableOpacity>
							<Subtitle>Imports</Subtitle>
						</TouchableOpacity>

						<TouchableOpacity>
							<Subtitle>Extracts</Subtitle>
						</TouchableOpacity>
					</View>

					<View className="flex-row gap-4">
						<FiltersToolbar
							activeFilter={activeFilter}
							setActiveFilter={setActiveFilter}
						/>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}
