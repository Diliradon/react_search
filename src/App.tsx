import { useState } from 'react';
import { DropdownButton } from './components/DropdownButton';
import { array } from './sources/array';

const coins = array;

export const App = () => {
  const [query, setQuery] = useState('');

  return (
    <main className="flex h-screen w-full justify-center">
      <div className="mt-16">
        <DropdownButton
          title="SEARCH"
          coins={coins}
          query={query}
          setQuery={setQuery}
        />
      </div>
    </main>
  );
};
