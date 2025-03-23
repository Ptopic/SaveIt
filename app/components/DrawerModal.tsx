import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

interface IProps {
	children: React.ReactNode;
	snapPoints?: string[];
}

type Ref = BottomSheet;

const DrawerModal = forwardRef<Ref, IProps>((props, ref) => {
	const snapPoints = useMemo(
		() => props.snapPoints || ['70%'],
		[props.snapPoints]
	);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
			/>
		),
		[]
	);

	return (
		<BottomSheet
			ref={ref}
			index={-1}
			snapPoints={snapPoints}
			backdropComponent={renderBackdrop}
			enablePanDownToClose={false}
			enableHandlePanningGesture={false}
			enableContentPanningGesture={false}
			handleComponent={() => null}
		>
			<BottomSheetView style={styles.addCollectionContentContainer}>
				{props.children}
			</BottomSheetView>
		</BottomSheet>
	);
});

export default DrawerModal;

const styles = StyleSheet.create({
	addCollectionContentContainer: {
		padding: 10,
		backgroundColor: 'white',
	},
});
