import React, { useState } from 'react';
import Rows from './Rows';
import SideMenu from './SideMenu';

const ParentComponent = () => {
    const [selectedGenre, setSelectedGenre] = useState(null);

    const handleSelectGenre = (genre) => {
        setSelectedGenre(genre);
    };

    return (
        <div>
            <SideMenu onSelectGenre={handleSelectGenre} />
            <Rows selectedGenre={selectedGenre} />
        </div>
    );
};

export default ParentComponent;
