import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrphanagesMap from './pages/OrphanagesMap';
import OrphanagesDetails from './pages/OrphanagesDetails';
import SelectMapPosition from './pages/CreateOrphanages/SelectMapPosition';
import OrphanageData from './pages/CreateOrphanages/OrphanageData';
import Header from './components/Header';
const Stack = createStackNavigator();

export default function routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: '#f2f3f5'
                    }
                }}
            >
                <Stack.Screen
                    name="OrphanagesMap"
                    component={OrphanagesMap}
                />
                <Stack.Screen
                    name="OrphanagesDetails"
                    component={OrphanagesDetails}
                    options={{
                        headerShown: true,
                        header: ()=> <Header showCancel={false} title='Orfanato'/>
                    }}
                />
                <Stack.Screen
                    name="SelectMapPosition"
                    component={SelectMapPosition}
                    options={{
                        headerShown: true,
                        header: ()=> <Header title='Selecione no mapa'/>
                    }}
                />
                <Stack.Screen
                    name="OrphanageData"
                    component={OrphanageData}
                    options={{
                        headerShown: true,
                        header: ()=> <Header title='Informe os dados'/>
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}