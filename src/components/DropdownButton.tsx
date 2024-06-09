import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { SearchInput } from './SearchInput';
import { CategorySearch } from '../types/coins';
import { SearchCategory } from './SearchCategory';
import searchIcon from '../icons/search-icon.svg';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { SearchList } from './SearchList';
import { getAllCoins } from '../api/search';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { twMerge } from 'tailwind-merge';

const ROW_HEIGHT = 40;
const VISIBLE_ITEMSLENGHT = 8;
const CONTEINER_HEIGHT = ROW_HEIGHT * VISIBLE_ITEMSLENGHT;

export const DropdownButton = () => {
  const [query, setQuery] = useState('');
  const [coins, setCoins] = useState<string[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<string[]>([]);
  const [favouriteCoins, setFavouriteCoins] = useLocalStorage<string[]>(
    'favouriteCoins',
    [],
  );

  const [activeCategory, setActiveCategory] = useState(
    CategorySearch.ALL_COINS,
  );
  const [isModal, setIsModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(coins, {
        threshold: 0.4,
      }),
    [coins],
  );
  const setUniqCoins = useMemo(
    () => new Set(favouriteCoins.map(coin => coin)),
    [favouriteCoins],
  );

  const SettingsList = {
    rowHeight: ROW_HEIGHT,
    totalItems: coins.length - 1,
    items: coins,
    containerHeight: CONTEINER_HEIGHT.toString(),
    visibleItemsLength: VISIBLE_ITEMSLENGHT,
  };

  const handleClickOutside = () => {
    setIsModal(false);
    setQuery('');
  };

  useOnClickOutside([modalRef], handleClickOutside);

  const handleFavouriteCoin = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, coin: string) => {
      e.stopPropagation();

      const isCoin = setUniqCoins.has(coin);

      if (isCoin) {
        setFavouriteCoins(currentCoins =>
          currentCoins.filter(currentCoin => currentCoin !== coin),
        );
      } else {
        setFavouriteCoins([...favouriteCoins, coin]);
      }
    },
    [favouriteCoins, setUniqCoins, setFavouriteCoins],
  );

  useEffect(() => {
    if (query) {
      const result = fuse.search(query).map(value => value.item);

      setFilteredCoins(result);
    } else {
      setFilteredCoins(coins);
    }
  }, [query, coins, fuse]);

  useEffect(() => {
    getAllCoins().then(res => {
      setCoins(res);
    });
  }, []);

  const visibleCoins = useMemo(() => {
    if (CategorySearch.ALL_COINS === activeCategory) {
      return filteredCoins;
    }

    return favouriteCoins.filter(coin =>
      coin.toLowerCase().includes(query.toLowerCase()),
    );
  }, [activeCategory, favouriteCoins, filteredCoins, query]);

  return (
    <>
      <button
        type="button"
        className={twMerge(
          `relative flex h-10 items-center gap-2 rounded-lg border-2 border-gray-300 bg-slate-950 p-2 text-gray-300`,
          !isModal && 'hover:bg-gray-400',
        )}
        onClick={() => setIsModal(true)}
        disabled={isModal}
      >
        <img
          src={searchIcon}
          alt="Search button"
          className="aspect-square h-4"
        />
        SEARCH
      </button>

      {isModal && (
        <div
          className={`absolute rounded-lg border-2 border-gray-300 bg-slate-900`}
          ref={modalRef}
        >
          <SearchInput
            image={searchIcon}
            altImage="Search Input"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <hr className="border border-gray-300" />

          <div className="flex gap-4 px-2 py-2.5">
            <SearchCategory
              type="button"
              disabled={activeCategory === CategorySearch.FAVOURITES}
              activeCategory={activeCategory}
              title={CategorySearch.FAVOURITES}
              onClick={() => setActiveCategory(CategorySearch.FAVOURITES)}
            />

            <SearchCategory
              type="button"
              disabled={activeCategory === CategorySearch.ALL_COINS}
              title={CategorySearch.ALL_COINS}
              activeCategory={activeCategory}
              onClick={() => setActiveCategory(CategorySearch.ALL_COINS)}
            />
          </div>

          <SearchList
            items={visibleCoins}
            favouriteCoins={favouriteCoins}
            handleFavouriteCoin={handleFavouriteCoin}
            SettingsList={SettingsList}
          />
        </div>
      )}
    </>
  );
};
