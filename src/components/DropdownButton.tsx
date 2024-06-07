import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { twMerge } from 'tailwind-merge';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { Coin, SearchCategory } from '../types/coins';
import searchIcon from '../images/icons/search-icon.svg';
import starActiveIcon from '../images/icons/star-active-icon.svg';
import starDefaultIcon from '../images/icons/star-default-icon.svg';

interface Props {
  title: string;
  coins: Coin[];
  query: string;
  setQuery: (item: string) => void;
}

export const DropdownButton: React.FC<Props> = ({
  title,
  coins,
  query,
  setQuery,
}) => {
  const [activeCategory, setActiveCategory] = useState<SearchCategory>(
    SearchCategory.ALL_COINS,
  );
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins);
  const [favouriteCoins, setFavouriteCoins] = useLocalStorage<Coin[]>(
    'favouriteCoins',
    [],
  );
  const dropdownRef = useRef(null);
  const setUniqCoins = useMemo(
    () => new Set(favouriteCoins.map(coin => coin.id)),
    [favouriteCoins],
  );
  const selectCategory =
    activeCategory === SearchCategory.ALL_COINS
      ? filteredCoins
      : favouriteCoins;

  const handleClickOutside = () => {
    setDropdownToggle(false);
  };

  useOnClickOutside([dropdownRef], handleClickOutside);

  const fuseOptions = useMemo(
    () => ({
      keys: ['title'],
      threshold: 0.4,
    }),
    [],
  );

  const fuse = useMemo(
    () => new Fuse(coins, fuseOptions),
    [coins, fuseOptions],
  );

  const handleFavouriteCoin = useCallback(
    (e: React.MouseEvent<HTMLImageElement, MouseEvent>, coin: Coin) => {
      e.stopPropagation();

      const isCoin = setUniqCoins.has(coin.id);

      if (isCoin) {
        setFavouriteCoins(currentCoins =>
          currentCoins.filter(currentCoin => currentCoin.id !== coin.id),
        );
      } else {
        setFavouriteCoins([...favouriteCoins, coin]);
      }
    },
    [favouriteCoins, setUniqCoins, setFavouriteCoins],
  );

  const handleChooseCoin = (coin: Coin) => {
    setQuery(coin.title);
    setDropdownToggle(false);
  };

  useEffect(() => {
    if (query) {
      const result = fuse.search(query).map(value => value.item);

      setFilteredCoins(result);
    } else {
      setFilteredCoins(coins);
    }
  }, [query, coins, fuse]);

  return (
    <div className="relative text-gray-300" ref={dropdownRef}>
      <button
        className={twMerge(
          `flex h-10 items-center gap-2 rounded-lg border-2 border-gray-300 bg-slate-950 p-2 text-gray-300 hover:bg-gray-400`,
          dropdownToggle && 'bg-gray-400 hover:bg-slate-950',
        )}
        onClick={() => setDropdownToggle(!dropdownToggle)}
      >
        <img className="aspect-square h-4" src={searchIcon} alt="Search Icon" />

        <p>{title}</p>
      </button>
      <div
        className={twMerge(
          `absolute right-0 top-10 hidden min-w-[260px] rounded-lg border-2 border-gray-300 bg-slate-900`,
          dropdownToggle && 'flex flex-col',
        )}
      >
        <label className="flex w-full items-center gap-2 px-4 py-2.5">
          <img
            className="aspect-square h-4"
            src={searchIcon}
            alt="Search Icon"
          />

          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-inherit text-white outline-none"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>

        <hr className="border border-gray-300" />

        <div className="flex flex-col px-2">
          <div className="flex gap-4 py-1">
            <button
              type="button"
              className={twMerge(
                `flex items-center justify-center gap-2 rounded-lg p-2 hover:bg-gray-400`,
                activeCategory === SearchCategory.FAVOURITES &&
                  'font-semibold text-white',
              )}
              onClick={() => setActiveCategory(SearchCategory.FAVOURITES)}
            >
              <img
                className="aspect-square h-4"
                src={starActiveIcon}
                alt="Star Favourite"
              />

              <p>{SearchCategory.FAVOURITES}</p>
            </button>

            <button
              type="button"
              className={twMerge(
                `text-nowrap rounded-lg p-2 hover:bg-gray-400`,
                activeCategory === SearchCategory.ALL_COINS &&
                  'font-semibold text-white',
              )}
              onClick={() => setActiveCategory(SearchCategory.ALL_COINS)}
            >
              {SearchCategory.ALL_COINS}
            </button>
          </div>

          <hr className="border border-gray-900" />

          <ul className="flex max-h-60 flex-col overflow-auto">
            {selectCategory.map(coin => {
              const isFavouriteCoin = favouriteCoins.find(
                favouriteCoin => favouriteCoin.id === coin.id,
              );

              return (
                <label
                  key={coin.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-400`}
                  onClick={() => handleChooseCoin(coin)}
                >
                  <img
                    className="aspect-square h-4"
                    src={isFavouriteCoin ? starActiveIcon : starDefaultIcon}
                    alt="Star Favourite"
                    onClick={e => handleFavouriteCoin(e, coin)}
                  />

                  <p>{coin.title}</p>
                </label>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
