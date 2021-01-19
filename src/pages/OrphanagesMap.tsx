import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import mapMarker from '../images/Local.png'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import useOrphanage from '../hooks/useOrphanage'


export default function OrphanagesMap() {
    const navigation = useNavigation();
    const { getOrphanages, orphanages } = useOrphanage();

    useFocusEffect(() => {
        getOrphanages();
    });

    const handleNavidateToOrphanateDetails = useCallback((id: number | undefined) => {
        navigation.navigate('OrphanagesDetails', { id })
    }, [navigation]);

    const handleNavigataToCreateOrphanage = useCallback(() => {
        navigation.navigate('SelectMapPosition')
    }, [navigation]);

    return (
        
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: -5.8111934,
                    longitude: -35.2478005,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08
                }}
            >
                {
                    orphanages.map(orphanage => (
                        <Marker
                            key={orphanage.id}
                            icon={mapMarker}
                            calloutAnchor={{
                                x: 2.4,
                                y: 0.8
                            }}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude
                            }}
                        >
                            <Callout
                                tooltip
                                onPress={() => handleNavidateToOrphanateDetails(orphanage.id)}
                            >
                                <View style={styles.calloutcontainer}>
                                    <Text style={styles.calloutText}>
                                        {orphanage.name}
                                    </Text>
                                </View>
                            </Callout>
                        </Marker>

                    ))
                }
            </MapView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {orphanages.length} Orfanatos encontrados
            </Text>
                <RectButton
                    style={styles.createOrphanageButton}
                    onPress={handleNavigataToCreateOrphanage}
                >
                    <Feather name="plus" sixe={24} color="#fff" />
                </RectButton>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    calloutcontainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,.8)',
        borderRadius: 16,
        justifyContent: 'center',
    },
    calloutText: {
        color: '#0089a5',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold'

    },
    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24,
        elevation: 3,

        backgroundColor: '#FFF',
        borderRadius: 20,
        height: 46,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    footerText: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_700Bold'
    },
    createOrphanageButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3c6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
