import {useState, useEffect} from 'react';
import Landing from './components/Home/Landing';
import Nav from './components/Home/Nav';
import Row from './components/Home/Rows'
import Menu from './components/Home/Menu';

function Home () {

    const [userToken0, setUserToken0] = useState(null);
    const [userDataDetails0, setUserDataDetails0] = useState('');

    const fetchUserData = async () => {
        const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

        const fetchConfig = {
        credentials: 'include',
        };

        const response = await fetch(tokenUrl, fetchConfig);
        const data = await response.json();
        if (data) {
            setUserToken0(data.access_token);
            setUserDataDetails0(data.account);
            return data.account;
        } else {
            console.log('No active token!')
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const homeLogOut = () => {
        setUserToken0(null);
        setUserDataDetails0('');
    }

    return(
        <div>
            <Nav
                userCookie0 = {userToken0}
                userData0 = {userDataDetails0}
                userLogOut0 = {homeLogOut}
            />
            <Menu />
            <Landing />
            <Row path="/" element={<Row />} />


        </div>
    )
}
export default Home
