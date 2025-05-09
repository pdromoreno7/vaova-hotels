'use client';

import { Input } from '@heroui/react';

function HotelInputSearch({
  nameSearch,
  setNameSearch,
}: {
  nameSearch: string;
  setNameSearch: (name: string) => void;
}) {
  console.log(nameSearch);

  return (
    <div>
      <Input placeholder="Buscar hotel" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} />
    </div>
  );
}

export default HotelInputSearch;
