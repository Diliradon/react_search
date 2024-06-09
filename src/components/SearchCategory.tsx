import { twMerge } from 'tailwind-merge';
import { CategorySearch } from '../types/coins';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  image?: string;
  altImage?: string;
  title: string;
  activeCategory: string;
}

export const SearchCategory: React.FC<Props> = ({
  image,
  altImage,
  title,
  activeCategory,
  ...rest
}) => (
  <button
    className={twMerge(
      `flex items-center gap-2 rounded-lg p-2 text-gray-400 transition-all duration-300`,
      activeCategory !== title && 'text-gray-100 hover:bg-gray-400',
    )}
    {...rest}
  >
    {title === CategorySearch.FAVOURITES && <p className="star starActive" />}

    <p
      className={twMerge(
        'text-nowrap',
        title !== activeCategory && 'font-semibold',
      )}
    >
      {title}
    </p>
  </button>
);
