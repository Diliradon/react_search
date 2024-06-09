interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  image: string;
  altImage: string;
}

export const SearchInput: React.FC<Props> = ({ image, altImage, ...rest }) => (
  <label className="flex w-full items-center gap-2 px-4 py-2.5">
    <img className="aspect-square h-4" src={image} alt={altImage} />

    <input
      type="search"
      placeholder="Search..."
      className="w-full bg-inherit text-white outline-none"
      {...rest}
    />
  </label>
);
