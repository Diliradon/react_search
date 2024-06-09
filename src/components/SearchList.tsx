import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { SettingsItems } from '../types/coins';

interface Props {
  items: string[];
  favouriteCoins: string[];
  SettingsList: SettingsItems;
  handleFavouriteCoin: (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    coin: string,
  ) => void;
}

export const SearchList: React.FC<Props> = ({
  items,
  favouriteCoins,
  SettingsList,
  handleFavouriteCoin,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * SettingsList.rowHeight;

  const startNodeElem = Math.floor(scrollTop / SettingsList.rowHeight);

  const endNodeElem = Math.min(
    startNodeElem + SettingsList.visibleItemsLength,
    items.length,
  );

  const visibleItems = items.slice(startNodeElem, endNodeElem);

  const offsetY = startNodeElem * SettingsList.rowHeight;

  const onScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <ul
      className={`flex h-fit max-h-60 flex-col overflow-auto rounded-b-lg bg-slate-700 px-2`}
      onScroll={e => onScroll(e)}
      style={{
        height: SettingsList.containerHeight,
      }}
    >
      {visibleItems.map(coin => {
        const isFavouriteCoin = favouriteCoins.some(
          favouriteCoin => favouriteCoin === coin,
        );

        return (
          <li
            key={coin}
            className={twMerge(
              `flex cursor-pointer items-center gap-2 rounded-lg p-2 text-slate-300 hover:bg-gray-400`,
              isFavouriteCoin && `text-slate-200 hover:bg-gray-400`,
            )}
            style={{
              height: totalHeight,
              maxHeight: SettingsList.rowHeight,
              transform: `translateY(${offsetY}px)`,
            }}
          >
            <p
              className={twMerge(
                'star',
                isFavouriteCoin ? 'starActive' : 'starDefault',
              )}
              onClick={e => handleFavouriteCoin(e, coin)}
            />
            <p>{coin}</p>
          </li>
        );
      })}
    </ul>
  );
};
