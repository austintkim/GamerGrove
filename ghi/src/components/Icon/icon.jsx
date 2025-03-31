import { useState, useEffect } from 'react'

const Icon = ({
    homeUserData,
    dashboardUserData,
    allGamesUserData,
    gamesDetailsUserData,
    boardDetailsUserData,
    searchResultsUserData,
}) => {
    const [iconUrl, setIconUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const userData =
        homeUserData ||
        dashboardUserData ||
        allGamesUserData ||
        gamesDetailsUserData ||
        boardDetailsUserData ||
        searchResultsUserData

    useEffect(() => {
        if (!userData?.icon_id) {
            setIsLoading(false)
            return
        }

        const fetchUserIcon = async () => {
            try {
                const iconResponse = await fetch(
                    `${import.meta.env.VITE_API_HOST}/api/icons/${
                        userData.icon_id
                    }`
                )
                const iconData = await iconResponse.json()
                setIconUrl(iconData.icon_url)
            } catch (error) {
                console.error('Error fetching icon:', error)
            }
            setIsLoading(false)
        }

        fetchUserIcon()
    }, [userData])

    if (isLoading) return null 

    return (
        <img
            src={
                iconUrl ||
                'https://static.vecteezy.com/system/resources/thumbnails/034/715/051/small/user-icon-in-trendy-flat-style-isolated-on-black-background-user-silhouette-symbol-for-your-web-site-design-logo-app-ui-windows-vector.jpg'
            }
            alt="User Icon"
            style={{ width: '60px', height: '60px' }}
        />
    )
}

export default Icon
