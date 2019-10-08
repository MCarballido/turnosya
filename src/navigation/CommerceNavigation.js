import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { IconButton } from '../components/common';
import ServicesList from '../components/ServicesList';
import ServiceForm from '../components/ServiceForm';
import CourtList from '../components/CourtList';
import CourtForm from '../components/CourtForm';
import ScheduleRegister from '../components/ScheduleRegister';
import CommerceProfile from '../components/CommerceProfile';
import CommerceSchedule from '../components/CommerceSchedule';
import ScheduleRegisterConfiguration from '../components/ScheduleRegisterConfiguration';
import CommerceCourtReservations from '../components/CommerceCourtReservations';
import CommerceCourtReservationDetails from '../components/CommerceCourtReservationDetails';
import {
  stackNavigationOptions,
  tabNavigationOptions
} from './NavigationOptions';

// Aca hay un stack por cada tab que tiene el tab navigation

const calendarStack = createStackNavigator(
  {
    calendar: {
      screen: CommerceSchedule,
      navigationOptions: ({ navigation }) => ({
        title: 'Calendario',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    scheduleRegister: {
      screen: ScheduleRegister,
      navigationOptions: {
        title: 'Generar calendario'
      }
    },
    registerConfiguration: {
      screen: ScheduleRegisterConfiguration,
      navigationOptions: {
        title: 'Límites de turnos'
      }
    }
  },
  stackNavigationOptions
);

/*
const servicesStack = createStackNavigator(
  {
    servicesList: {
      screen: ServicesList,
      navigationOptions: ({ navigation }) => ({
        title: 'Servicios',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    serviceForm: {
      screen: ServiceForm,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Nuevo Servicio')
      })
    }
  },
  stackNavigationOptions
);
*/

const reservationsStack = createStackNavigator(
  {
    reservationsList: {
      screen: CommerceCourtReservations,
      navigationOptions: ({ navigation }) => ({
        title: 'Turnos',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    reservationDetails: { // la pantalla de detalles del turno que es alternativa al modal
      screen: CommerceCourtReservationDetails,
      navigationOptions: {
        title: 'Detalles del Turno'
      }
    },
  },
  stackNavigationOptions
);

const courtsStack = createStackNavigator(
  {
    courtsList: {
      screen: CourtList,
      navigationOptions: ({ navigation }) => ({
        title: 'Canchas',
        headerLeft: (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    },
    courtForm: {
      screen: CourtForm,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', 'Nueva Cancha')
      })
    }
  },
  stackNavigationOptions
);

const profileStack = createStackNavigator(
  {
    profile: {
      screen: CommerceProfile,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: navigation.getParam('leftIcon') || (
          <IconButton icon="md-menu" onPress={navigation.openDrawer} />
        )
      })
    }
  },
  stackNavigationOptions
);

// Aca se define el tab navigation y se agrega el stack correspondiente en cada tab

const commerceTabs = createBottomTabNavigator(
  {
    courts: courtsStack,
    reservations: reservationsStack,
    calendar: calendarStack,
    profile: profileStack
  },
  {
    ...tabNavigationOptions,
    initialRouteName: 'reservations'
  }
);

const CommerceNavigation = createAppContainer(commerceTabs);

export default CommerceNavigation;
