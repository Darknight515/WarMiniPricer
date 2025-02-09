import { createContext, useState, useContext, useEffect } from "react";

const MiniContext = createContext();

export const useMiniContext = () => useContext(MiniContext);

export const MiniProvider = ({children}) => {
    const [minis, setMinis] = useState([]);

    useEffect(() => {
        const storedMinis = localStorage.getItem("minis");

        if(storedMinis) setMinis(JSON.parse(storedMinis));
    }, []);

    useEffect(() => {
        localStorage.setItem('minis', JSON.stringify(minis));
    }, [minis]);

    const addMiniToCart = (mini) => {
        setMinis(prev => [...prev, mini])
    }

    const removeMiniToCart = (miniId) => {
        setMinis(prev => prev.filter(mini => mini.id !== miniId))
    }

    const isInCart = (miniId) => {
        return minis.some(mini => mini.id == miniId)
    }

    const value = {
        minis,
        addMiniToCart,
        removeMiniToCart,
        isInCart
    }

    return (
    <MiniContext.Provider value={value}>
        {children}
    </MiniContext.Provider>
    )
}