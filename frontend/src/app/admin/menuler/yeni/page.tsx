import React from 'react';
import NewMenu from '@/components/Dashboard/NewMenu';

const NewMenuForm = () => {
    return (
        <>
           <div className="flex justify-between flex-nowrap basis-full text-xl text-bold mb-4">
            <h1 className="mt-2">Yeni Menü Ekle</h1>
          </div>

          <NewMenu />
        </>
    );
}

export default NewMenuForm;