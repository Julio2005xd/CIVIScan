import { useState, useCallback } from 'react';
import { Coordinates } from '../types';

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: false,
    error: null,
  });

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'La geolocalización no está disponible en este navegador.',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (err) => {
        let errorMsg = 'No se pudo obtener la ubicación.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Permiso de ubicación denegado. Por favor, actívalo en tu navegador.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = 'Información de ubicación no disponible.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Tiempo de espera agotado para obtener la ubicación.';
        }
        setState({ coordinates: null, loading: false, error: errorMsg });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    getCurrentPosition,
    clearError,
  };
}
