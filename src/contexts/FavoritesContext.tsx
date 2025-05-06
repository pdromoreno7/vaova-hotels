'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hotel } from '@/interface/hotels.interface';

/**
 * Interface defining the shape of the Favorites context
 */
interface FavoritesContextProps {
  favorites: Hotel[];
  addFavorite: (hotel: Hotel) => void;
  removeFavorite: (hotelId: string) => void;
  isFavorite: (hotelId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

/**
 * Provider component for favorites context
 * Manages favorite hotels state and persists to localStorage
 */
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Hotel[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = (hotel: Hotel) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === hotel.id)) {
        return prev; // Hotel is already in favorites
      }
      return [...prev, hotel];
    });
  };

  const removeFavorite = (hotelId: string) => {
    setFavorites((prev) => prev.filter((hotel) => hotel.id !== hotelId));
  };

  const isFavorite = (hotelId: string) => {
    return favorites.some((hotel) => hotel.id === hotelId);
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        isFavorite, 
        favoritesCount: favorites.length 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Hook to access the favorites context
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
