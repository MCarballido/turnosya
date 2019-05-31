import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ServicesList from '../components/ServicesList';
import ServiceForm from '../components/ServiceForm';

const navigationOptions = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#c72c41'
        },
        headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontSize: 20,
            color: '#fff',
            fontWeight: 'bold'
        }
    }
};

const rightIcon = (navigation, icon, nextScreen) => <Icon
    name={icon}
    style={{ marginRight: 15 }}
    size={30}
    color='white'
    onPress={() => navigation.navigate(nextScreen)}
/>

const commerceScreenStack = createStackNavigator({
    servicesList: {
        screen: ServicesList,
        navigationOptions: ({ navigation }) => ({
            title: 'Servicios',
            headerRight: rightIcon(navigation, 'add', 'serviceForm')
        })
    },
    serviceForm: {
        screen: ServiceForm,
        navigationOptions: ({ navigation }) => ({
            title: 'Servicios'
        })
    }
},
    navigationOptions
)

const CommerceLogged = createAppContainer(commerceScreenStack)

export default CommerceLogged;